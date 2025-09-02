import { useState, useCallback, useMemo, useEffect } from 'react';
import { TrueLayerApiService } from '@/lib/truelayer-api';
import {
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
  TrueLayerCard
} from '@/types/truelayer-api';

interface UseTrueLayerApiReturn {
  // État
  loading: boolean;
  error: string | null;
  accessToken: string | null;
  accounts: TrueLayerAccount[];
  balances: Record<string, TrueLayerBalance[]>;
  transactions: Record<string, TrueLayerTransaction[]>;
  cards: Record<string, TrueLayerCard[]>;
  userData: Record<string, any> | null;
  
  // Actions
  connectBank: () => void;
  connectAndFetchData: () => Promise<void>;
  handleAuthCallback: (authCode: string) => Promise<void>;
  setAccessToken: (token: string) => void;
  fetchUserData: () => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchAccountBalances: (accountId: string) => Promise<void>;
  getAccountBalances: (accountId: string) => Promise<TrueLayerBalance[]>;
  fetchAccountTransactions: (accountId: string, fromDate?: string, toDate?: string) => Promise<void>;
  getAccountTransactions: (accountId: string, fromDate?: string, toDate?: string) => Promise<TrueLayerTransaction[]>;
  fetchAccountCards: (accountId: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  disconnect: () => void;
  
  // Utilitaires
  isConnected: boolean;
  authUrl: string | null;
}

export function useTrueLayerApi(
  clientId: string,
  clientSecret: string,
  redirectUri: string
): UseTrueLayerApiReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(() => {
    // Récupérer le token depuis localStorage au montage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('truelayer_access_token');
    }
    return null;
  });
  const [accounts, setAccounts] = useState<TrueLayerAccount[]>([]);
  const [balances, setBalances] = useState<Record<string, TrueLayerBalance[]>>({});
  const [transactions, setTransactions] = useState<Record<string, TrueLayerTransaction[]>>({});
  const [cards, setCards] = useState<Record<string, TrueLayerCard[]>>({});
  const [userData, setUserData] = useState<Record<string, any> | null>(null);
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  // Service API
  const apiService = useMemo(() => {
    if (!clientId || !clientSecret || !redirectUri) return null;
    return new TrueLayerApiService(clientId, clientSecret, redirectUri);
  }, [clientId, clientSecret, redirectUri]);

  // Initialiser le service avec le token si disponible
  useEffect(() => {
    if (apiService && accessToken) {
      apiService.setAccessToken(accessToken);
    }
  }, [apiService, accessToken]);

  // Vérifier si connecté
  const isConnected = useMemo(() => {
    return apiService?.isTokenValid() || false;
  }, [apiService]);

  // Connecter à la banque et récupérer le token automatiquement
  const connectBank = useCallback(async () => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Génération de l\'URL d\'autorisation...');
      const url = apiService.getAuthUrl();
      setAuthUrl(url);
      console.log('✅ URL d\'autorisation générée:', url);
      
      // Pour l'instant, on génère juste l'URL
      // Dans un vrai scénario, il faudrait que l'utilisateur visite cette URL
      // et revienne avec le code d'autorisation
      console.log('ℹ️ Visitez cette URL pour obtenir le code d\'autorisation');
      
    } catch (err) {
      setError(`Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Se connecter et récupérer automatiquement toutes les données
  const connectAndFetchData = useCallback(async () => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Étape 1: Générer l'URL d'autorisation via l'API serveur
      console.log('🔄 Génération de l\'URL d\'autorisation...');
      const authUrl = await apiService.getAuthUrlViaServer();
      setAuthUrl(authUrl);
      console.log('✅ URL d\'autorisation générée:', authUrl);
      
      // Ouvrir dans une popup au lieu de rediriger
      const popup = window.open(
        authUrl,
        'truelayer-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Impossible d\'ouvrir la popup. Vérifiez que les popups ne sont pas bloquées.');
      }

      // Écouter la fermeture de la popup ou le message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          setLoading(false);
          console.log('Popup fermée par l\'utilisateur');
        }
      }, 1000);

      // Écouter les messages de la popup
      const messageHandler = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'TRUELAYER_AUTH_SUCCESS' && event.data.code) {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          
          // Traiter le code d'autorisation
          handleAuthCallback(event.data.code);
        } else if (event.data.type === 'TRUELAYER_AUTH_ERROR') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', messageHandler);
          setError(event.data.error || 'Erreur d\'authentification');
          setLoading(false);
        }
      };

      window.addEventListener('message', messageHandler);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(`Erreur lors de la connexion: ${errorMessage}`);
      console.error('❌ Erreur lors de la connexion:', err);
      setLoading(false);
    }
  }, [apiService]);

  // Gérer le callback d'authentification
  const handleAuthCallback = useCallback(async (authCode: string) => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Étape 1: Récupérer le token via l'API serveur
      console.log('🔄 Échange du code d\'autorisation contre un token...');
      const tokenResponse = await apiService.exchangeCodeForTokenViaServer(authCode);
      setAccessTokenState(tokenResponse.access_token);
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('truelayer_access_token', tokenResponse.access_token);
      }
      console.log('✅ Authentification TrueLayer réussie');
      
      // Étape 2: Récupérer les données utilisateur
      console.log('🔄 Récupération des données utilisateur...');
      try {
        const userDataResponse = await apiService.getUserData();
        setUserData(userDataResponse);
        console.log('✅ Données utilisateur récupérées:', userDataResponse);
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des données utilisateur:', err);
      }
      
      // Étape 3: Récupérer les comptes et leurs soldes
      console.log('🔄 Récupération des comptes...');
      try {
        const accountsData = await apiService.getAccounts();
        console.log('📊 Données comptes reçues:', accountsData);
        
              // Vérifier le format des données et extraire les comptes
      let accounts: TrueLayerAccount[] = [];
      if (Array.isArray(accountsData)) {
        accounts = accountsData;
      } else if (accountsData && typeof accountsData === 'object' && 'results' in accountsData && Array.isArray((accountsData as any).results)) {
        accounts = (accountsData as any).results;
      } else if (accountsData && typeof accountsData === 'object' && 'accounts' in accountsData && Array.isArray((accountsData as any).accounts)) {
        accounts = (accountsData as any).accounts;
      } else {
        console.warn('Format de données inattendu:', accountsData);
        accounts = [];
      }
        
        setAccounts(accounts);
        console.log(`✅ ${accounts.length} comptes récupérés`);
        
        // Récupérer automatiquement les soldes pour chaque compte
        if (accounts.length > 0) {
          console.log('🔄 Récupération des soldes pour chaque compte...');
          for (const account of accounts) {
            try {
              const balancesData = await apiService.getAccountBalances(account.account_id);
              setBalances(prev => ({
                ...prev,
                [account.account_id]: balancesData
              }));
              console.log(`✅ Soldes récupérés pour le compte: ${account.display_name}`);
            } catch (err) {
              console.error(`❌ Erreur pour le compte ${account.display_name}:`, err);
            }
          }
          console.log('✅ Tous les soldes récupérés');
        } else {
          console.log('ℹ️ Aucun compte trouvé');
        }
      } catch (err) {
        console.error('❌ Erreur lors de la récupération des comptes:', err);
      }
      
      console.log('✅ Toutes les données récupérées avec succès !');
    } catch (err) {
      setError(`Erreur d'authentification: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Définir un token d'accès directement
  const setAccessToken = useCallback((token: string) => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    try {
      apiService.setAccessToken(token);
      setAccessTokenState(token);
      // Sauvegarder dans localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('truelayer_access_token', token);
      }
      console.log('✅ Token d\'accès défini avec succès');
    } catch (err) {
      setError(`Erreur lors de la définition du token: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    }
  }, [apiService]);

  // Récupérer les données utilisateur
  const fetchUserData = useCallback(async () => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    try {
      console.log('🔄 Récupération des données utilisateur...');
      const userDataResponse = await apiService.getUserData();
      setUserData(userDataResponse);
      console.log('✅ Données utilisateur récupérées:', userDataResponse);
    } catch (err) {
      console.error('❌ Erreur lors de la récupération des données utilisateur:', err);
      // Ne pas bloquer le processus si les données utilisateur échouent
    }
  }, [apiService]);

  // Récupérer les comptes
  const fetchAccounts = useCallback(async () => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('🔄 Récupération des comptes...');
      const accountsData = await apiService.getAccounts();
      console.log('📊 Données comptes reçues:', accountsData);
      
      // Vérifier le format des données et extraire les comptes
      let accounts: TrueLayerAccount[] = [];
      if (Array.isArray(accountsData)) {
        accounts = accountsData;
      } else if (accountsData && typeof accountsData === 'object' && 'results' in accountsData && Array.isArray((accountsData as any).results)) {
        accounts = (accountsData as any).results;
      } else if (accountsData && typeof accountsData === 'object' && 'accounts' in accountsData && Array.isArray((accountsData as any).accounts)) {
        accounts = (accountsData as any).accounts;
      } else {
        console.warn('Format de données inattendu:', accountsData);
        accounts = [];
      }
      
      setAccounts(accounts);
      console.log(`✅ ${accounts.length} comptes récupérés`);
      
      // Récupérer automatiquement les soldes pour chaque compte
      if (accounts.length > 0) {
        console.log('🔄 Récupération des soldes pour chaque compte...');
        for (const account of accounts) {
          try {
            await fetchAccountBalances(account.account_id);
            console.log(`✅ Soldes récupérés pour le compte: ${account.display_name}`);
          } catch (err) {
            console.error(`❌ Erreur pour le compte ${account.display_name}:`, err);
          }
        }
        console.log('✅ Tous les soldes récupérés');
      } else {
        console.log('ℹ️ Aucun compte trouvé');
      }
    } catch (err) {
      setError(`Erreur lors de la récupération des comptes: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Récupérer les soldes d'un compte
  const fetchAccountBalances = useCallback(async (accountId: string) => {
    if (!apiService) return;

    try {
      const balancesData = await apiService.getAccountBalances(accountId);
      setBalances(prev => ({
        ...prev,
        [accountId]: balancesData
      }));
    } catch (err) {
      console.error(`Erreur lors de la récupération des soldes pour ${accountId}:`, err);
    }
  }, [apiService]);

  // Récupérer les transactions d'un compte
  const fetchAccountTransactions = useCallback(async (
    accountId: string,
    fromDate?: string,
    toDate?: string
  ) => {
    if (!apiService) return;

    try {
      const transactionsData = await apiService.getAccountTransactions(accountId, fromDate, toDate);
      setTransactions(prev => ({
        ...prev,
        [accountId]: transactionsData
      }));
    } catch (err) {
      console.error(`Erreur lors de la récupération des transactions pour ${accountId}:`, err);
    }
  }, [apiService]);

  // Récupérer les cartes d'un compte
  const fetchAccountCards = useCallback(async (accountId: string) => {
    if (!apiService) return;

    try {
      const cardsData = await apiService.getAccountCards(accountId);
      setCards(prev => ({
        ...prev,
        [accountId]: cardsData
      }));
    } catch (err) {
      console.error(`Erreur lors de la récupération des cartes pour ${accountId}:`, err);
    }
  }, [apiService]);

  // Rafraîchir le token
  const refreshToken = useCallback(async () => {
    if (!apiService) return;

    setLoading(true);
    setError(null);

    try {
      await apiService.refreshAccessToken();
      console.log('✅ Token rafraîchi avec succès');
    } catch (err) {
      setError(`Erreur lors du rafraîchissement du token: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
    }
  }, [apiService]);

  // Déconnecter
  const disconnect = useCallback(() => {
    setAccounts([]);
    setBalances({});
    setTransactions({});
    setCards({});
    setUserData(null);
    setAuthUrl(null);
    setAccessTokenState(null);
    setError(null);
    
    // Supprimer du localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('truelayer_access_token');
    }
    
    // Réinitialiser le service
    if (apiService) {
      apiService.setAccessToken('');
    }
  }, [apiService]);

  // Méthode pour récupérer les soldes d'un compte (retourne directement les données)
  const getAccountBalances = useCallback(async (accountId: string) => {
    if (!apiService) return [];

    try {
      const balancesData = await apiService.getAccountBalances(accountId);
      
      // Vérifier le format des données et extraire les soldes
      let balances: TrueLayerBalance[] = [];
      if (Array.isArray(balancesData)) {
        balances = balancesData;
      } else if (balancesData && typeof balancesData === 'object' && 'results' in balancesData && Array.isArray((balancesData as any).results)) {
        balances = (balancesData as any).results;
      } else if (balancesData && typeof balancesData === 'object' && 'balances' in balancesData && Array.isArray((balancesData as any).balances)) {
        balances = (balancesData as any).balances;
      } else {
        console.warn('Format de données de soldes inattendu:', balancesData);
        balances = [];
      }
      
      return balances;
    } catch (err) {
      console.error(`Erreur lors de la récupération des soldes pour ${accountId}:`, err);
      return [];
    }
  }, [apiService]);

  // Méthode pour récupérer les transactions d'un compte (retourne directement les données)
  const getAccountTransactions = useCallback(async (accountId: string, fromDate?: string, toDate?: string) => {
    if (!apiService) return [];

    try {
      const transactionsData = await apiService.getAccountTransactions(accountId, fromDate, toDate);
      
      // Vérifier le format des données et extraire les transactions
      let transactions: TrueLayerTransaction[] = [];
      if (Array.isArray(transactionsData)) {
        transactions = transactionsData;
      } else if (transactionsData && typeof transactionsData === 'object' && 'results' in transactionsData && Array.isArray((transactionsData as any).results)) {
        transactions = (transactionsData as any).results;
      } else if (transactionsData && typeof transactionsData === 'object' && 'transactions' in transactionsData && Array.isArray((transactionsData as any).transactions)) {
        transactions = (transactionsData as any).transactions;
      } else {
        console.warn('Format de données de transactions inattendu:', transactionsData);
        transactions = [];
      }
      
      return transactions;
    } catch (err) {
      console.error(`Erreur lors de la récupération des transactions pour ${accountId}:`, err);
      return [];
    }
  }, [apiService]);

  return {
    // État
    loading,
    error,
    accessToken,
    accounts,
    balances,
    transactions,
    cards,
    userData,
    
    // Actions
    connectBank,
    connectAndFetchData,
    handleAuthCallback,
    setAccessToken,
    fetchUserData,
    fetchAccounts,
    fetchAccountBalances,
    getAccountBalances,
    fetchAccountTransactions,
    getAccountTransactions,
    fetchAccountCards,
    refreshToken,
    disconnect,
    
    // Utilitaires
    isConnected,
    authUrl
  };
} 