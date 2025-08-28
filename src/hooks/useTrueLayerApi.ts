import { useState, useCallback, useMemo } from 'react';
import { TrueLayerApiService } from '@/lib/truelayer-api';
import {
  TrueLayerAccount,
  TrueLayerBalance,
  TrueLayerTransaction,
  TrueLayerCard,
  TrueLayerAuthResponse
} from '@/types/truelayer-api';

interface UseTrueLayerApiReturn {
  // État
  loading: boolean;
  error: string | null;
  accounts: TrueLayerAccount[];
  balances: Record<string, TrueLayerBalance[]>;
  transactions: Record<string, TrueLayerTransaction[]>;
  cards: Record<string, TrueLayerCard[]>;
  
  // Actions
  connectBank: () => void;
  handleAuthCallback: (authCode: string) => Promise<void>;
  fetchAccounts: () => Promise<void>;
  fetchAccountBalances: (accountId: string) => Promise<void>;
  fetchAccountTransactions: (accountId: string, fromDate?: string, toDate?: string) => Promise<void>;
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
  const [accounts, setAccounts] = useState<TrueLayerAccount[]>([]);
  const [balances, setBalances] = useState<Record<string, TrueLayerBalance[]>>({});
  const [transactions, setTransactions] = useState<Record<string, TrueLayerTransaction[]>>({});
  const [cards, setCards] = useState<Record<string, TrueLayerCard[]>>({});
  const [authUrl, setAuthUrl] = useState<string | null>(null);

  // Service API
  const apiService = useMemo(() => {
    if (!clientId || !clientSecret || !redirectUri) return null;
    return new TrueLayerApiService(clientId, clientSecret, redirectUri);
  }, [clientId, clientSecret, redirectUri]);

  // Vérifier si connecté
  const isConnected = useMemo(() => {
    return apiService?.isTokenValid() || false;
  }, [apiService]);

  // Connecter à la banque
  const connectBank = useCallback(() => {
    if (!apiService) {
      setError('Service API non initialisé');
      return;
    }

    try {
      const url = apiService.getAuthUrl();
      setAuthUrl(url);
      // Rediriger vers l'URL d'autorisation
      window.location.href = url;
    } catch (err) {
      setError(`Erreur de connexion: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
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
      const tokenData: TrueLayerAuthResponse = await apiService.exchangeCodeForToken(authCode);
      console.log('✅ Authentification TrueLayer réussie');
      
      // Récupérer automatiquement les comptes
      await fetchAccounts();
    } catch (err) {
      setError(`Erreur d'authentification: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setLoading(false);
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
      const accountsData = await apiService.getAccounts();
      setAccounts(accountsData);
      
      // Récupérer automatiquement les soldes pour chaque compte
      for (const account of accountsData) {
        await fetchAccountBalances(account.account_id);
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
    setAuthUrl(null);
    setError(null);
    
    // Réinitialiser le service
    if (apiService) {
      apiService.setAccessToken('');
    }
  }, [apiService]);

  return {
    // État
    loading,
    error,
    accounts,
    balances,
    transactions,
    cards,
    
    // Actions
    connectBank,
    handleAuthCallback,
    fetchAccounts,
    fetchAccountBalances,
    fetchAccountTransactions,
    fetchAccountCards,
    refreshToken,
    disconnect,
    
    // Utilitaires
    isConnected,
    authUrl
  };
} 