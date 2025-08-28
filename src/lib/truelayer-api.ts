import {
  TrueLayerAuthResponse,
  TrueLayerProvider,
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
  TrueLayerCard,
  TrueLayerError
} from '@/types/truelayer-api';

export class TrueLayerApiService {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor(clientId: string, clientSecret: string, redirectUri: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  }

  /**
   * Étape 1: Générer l'URL d'autorisation OAuth2
   */
  getAuthUrl(state?: string): string {
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: 'accounts balance transactions cards direct_debits standing_orders offline_access',
      state: state || 'default',
      providers: 'uk-ob-all' // Toutes les banques UK Open Banking
    });

    return `https://auth.truelayer.com/connect/oauth2/authorize?${params.toString()}`;
  }

  /**
   * Étape 2: Échanger le code d'autorisation contre un token
   */
  async exchangeCodeForToken(authCode: string): Promise<TrueLayerAuthResponse> {
    try {
      const response = await fetch('https://auth.truelayer.com/connect/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code: authCode,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur d'authentification: ${error.error_description || error.error}`);
      }

      const tokenData: TrueLayerAuthResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;

      console.log('✅ Token TrueLayer obtenu avec succès');
      return tokenData;
    } catch (error) {
      console.error('❌ Erreur lors de l\'échange du code:', error);
      throw error;
    }
  }

  /**
   * Étape 3: Rafraîchir le token d'accès
   */
  async refreshAccessToken(): Promise<TrueLayerAuthResponse> {
    if (!this.refreshToken) {
      throw new Error('Aucun refresh token disponible');
    }

    try {
      const response = await fetch('https://auth.truelayer.com/connect/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur de rafraîchissement: ${error.error_description || error.error}`);
      }

      const tokenData: TrueLayerAuthResponse = await response.json();
      this.accessToken = tokenData.access_token;
      this.refreshToken = tokenData.refresh_token;

      console.log('✅ Token TrueLayer rafraîchi avec succès');
      return tokenData;
    } catch (error) {
      console.error('❌ Erreur lors du rafraîchissement du token:', error);
      throw error;
    }
  }

  /**
   * Étape 4: Récupérer la liste des comptes
   */
  async getAccounts(): Promise<TrueLayerAccount[]> {
    if (!this.accessToken) {
      throw new Error('Token d\'accès non disponible');
    }

    try {
      const response = await fetch('/api/truelayer/accounts', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API: ${error.error_description || error.error}`);
      }

      const accounts: TrueLayerAccount[] = await response.json();
      console.log(`✅ ${accounts.length} comptes récupérés`);
      return accounts;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des comptes:', error);
      throw error;
    }
  }

  /**
   * Étape 5: Récupérer les soldes des comptes
   */
  async getAccountBalances(accountId: string): Promise<TrueLayerBalance[]> {
    if (!this.accessToken) {
      throw new Error('Token d\'accès non disponible');
    }

    try {
      const response = await fetch(`/api/truelayer/accounts/${accountId}/balances`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API: ${error.error_description || error.error}`);
      }

      const balances: TrueLayerBalance[] = await response.json();
      console.log(`✅ Soldes récupérés pour le compte ${accountId}`);
      return balances;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des soldes:', error);
      throw error;
    }
  }

  /**
   * Étape 6: Récupérer les transactions d'un compte
   */
  async getAccountTransactions(
    accountId: string,
    fromDate?: string,
    toDate?: string
  ): Promise<TrueLayerTransaction[]> {
    if (!this.accessToken) {
      throw new Error('Token d\'accès non disponible');
    }

    try {
      const params = new URLSearchParams();
      if (fromDate) params.append('from', fromDate);
      if (toDate) params.append('to', toDate);

      const response = await fetch(`/api/truelayer/accounts/${accountId}/transactions?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API: ${error.error_description || error.error}`);
      }

      const transactions: TrueLayerTransaction[] = await response.json();
      console.log(`✅ ${transactions.length} transactions récupérées pour le compte ${accountId}`);
      return transactions;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des transactions:', error);
      throw error;
    }
  }

  /**
   * Récupérer les cartes d'un compte
   */
  async getAccountCards(accountId: string): Promise<TrueLayerCard[]> {
    if (!this.accessToken) {
      throw new Error('Token d\'accès non disponible');
    }

    try {
      const response = await fetch(`/api/truelayer/accounts/${accountId}/cards`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Erreur API: ${error.error_description || error.error}`);
      }

      const cards: TrueLayerCard[] = await response.json();
      console.log(`✅ ${cards.length} cartes récupérées pour le compte ${accountId}`);
      return cards;
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des cartes:', error);
      throw error;
    }
  }

  /**
   * Vérifier si le token est valide
   */
  isTokenValid(): boolean {
    return !!this.accessToken;
  }

  /**
   * Définir un token d'accès (pour les tests)
   */
  setAccessToken(token: string): void {
    this.accessToken = token;
  }
} 