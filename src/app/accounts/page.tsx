'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, PiggyBank, TrendingUp, Eye, EyeOff, Plus, RefreshCw, AlertCircle, Receipt, Calendar, BarChart3 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BankAccount } from '@/types/openbanking';
import { TrueLayerAccount, TrueLayerBalance } from '@/types/truelayer-api';
import { useTrueLayerApi } from '@/hooks/useTrueLayerApi';
import TransactionAnalytics from '@/components/TransactionAnalytics';



export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [balances, setBalances] = useState<Map<string, TrueLayerBalance>>(new Map());
  const [transactions, setTransactions] = useState<Map<string, any[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const { 
    accounts: trueLayerAccounts, 
    accessToken, 
    loading: apiLoading,
    error: apiError,
    fetchAccounts,
    getAccountBalances,
    getAccountTransactions
  } = useTrueLayerApi(
    'openbank-d33846',
    '5fe1e369-e616-4687-9512-767710c2428a',
    'http://localhost:3000/callback'
  );

  // Convertir les comptes TrueLayer en format BankAccount
  const convertTrueLayerAccount = (account: TrueLayerAccount): BankAccount => {
    const accountNumber = account.account_number?.number || 
                         account.account_number?.iban || 
                         account.account_id.slice(-4);
    
    // Déterminer le type de compte basé sur le nom et le type
    let accountType = account.account_type || 'checking';
    let accountName = account.display_name || account.description || 'Compte';
    
    // Améliorer la détection des types de comptes
    const name = accountName.toLowerCase();
    if (name.includes('épargne') || name.includes('epargne') || name.includes('savings') || account.account_type === 'SAVINGS') {
      accountType = 'savings';
    } else if (name.includes('pea') || name.includes('pea')) {
      accountType = 'investment';
    } else if (name.includes('assurance') || name.includes('assurance vie')) {
      accountType = 'insurance';
    } else if (name.includes('crédit') || name.includes('credit') || name.includes('carte') || account.account_type === 'CREDIT_CARD') {
      accountType = 'credit';
    } else if (name.includes('compte courant') || name.includes('current') || account.account_type === 'TRANSACTION') {
      accountType = 'checking';
    }
    
    return {
      id: account.account_id,
      name: accountName,
      accountNumber: `****${accountNumber}`,
      balance: 0, // Sera mis à jour avec les soldes
      currency: account.currency,
      type: accountType,
      status: 'active',
      lastUpdated: new Date(account.update_timestamp),
      provider: account.provider.display_name,
      iban: account.account_number?.iban
    };
  };

  // Charger les comptes et leurs soldes
  const loadAccountsData = async () => {
    if (!accessToken) {
      setError('Aucun token d\'accès disponible. Veuillez vous connecter d\'abord.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Récupérer les comptes
      await fetchAccounts();
      
      // Récupérer les soldes et transactions pour chaque compte
      const balancesMap = new Map<string, TrueLayerBalance>();
      const transactionsMap = new Map<string, any[]>();
      const convertedAccounts: BankAccount[] = [];

            // Calculer la date depuis le 1er janvier 2025
      const fromDate = new Date('2025-01-01');
      const fromDateString = fromDate.toISOString().split('T')[0];
      const today = new Date();
      const todayString = today.toISOString().split('T')[0];

      console.log(`📅 Date d'aujourd'hui: ${todayString}`);
      console.log(`📅 Date de début (depuis 01/01/2025): ${fromDateString}`);

      for (const account of trueLayerAccounts) {
        try {
          // Récupérer le solde
          const balance = await getAccountBalances(account.account_id);
          if (balance && balance.length > 0) {
            balancesMap.set(account.account_id, balance[0]);
          }
        } catch (balanceError) {
          console.warn(`Impossible de récupérer le solde pour ${account.account_id}:`, balanceError);
        }

        try {
          // Récupérer les transactions des 90 derniers jours
          console.log(`🔄 Récupération des transactions pour ${account.display_name} depuis ${fromDateString}...`);
          const accountTransactions = await getAccountTransactions(account.account_id, fromDateString);
          if (accountTransactions && accountTransactions.length > 0) {
            transactionsMap.set(account.account_id, accountTransactions);
            console.log(`✅ ${accountTransactions.length} transactions récupérées pour ${account.display_name}`);
          }
        } catch (transactionError) {
          console.warn(`Impossible de récupérer les transactions pour ${account.account_id}:`, transactionError);
        }
        
        const convertedAccount = convertTrueLayerAccount(account);
        convertedAccounts.push(convertedAccount);
      }

      // Mettre à jour les soldes dans les comptes
      const accountsWithBalances = convertedAccounts.map(account => {
        const balance = balancesMap.get(account.id);
        return {
          ...account,
          balance: balance?.current || 0,
          availableBalance: balance?.available,
          overdraft: balance?.overdraft
        };
      });

      setAccounts(accountsWithBalances);
      setBalances(balancesMap);
      setTransactions(transactionsMap);
    } catch (err) {
      console.error('Erreur lors du chargement des comptes:', err);
      setError('Erreur lors du chargement des comptes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    if (accessToken) {
      loadAccountsData();
    }
  }, [accessToken]);

  const formatCurrency = (amount: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTransactionAmount = (amount: number, currency: string = 'EUR') => {
    const formatted = formatCurrency(Math.abs(amount), currency);
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  };

  const getAccountIcon = (type: string) => {
    return type === 'checking' ? (
      <CreditCard className="h-6 w-6 text-blue-600" />
    ) : (
      <PiggyBank className="h-6 w-6 text-green-600" />
    );
  };

  const getAccountTypeLabel = (type: string) => {
    const labels = {
      checking: 'Compte Courant',
      savings: 'Épargne',
      credit: 'Crédit',
      investment: 'Investissement'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Comptes</h1>
          <p className="text-gray-600">Gérez tous vos comptes bancaires</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={loadAccountsData} 
            disabled={loading || !accessToken}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Button disabled={!accessToken}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un compte
          </Button>
        </div>
      </div>

      {/* Message d'erreur */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Message si pas connecté */}
      {!accessToken && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-yellow-600">
              <AlertCircle className="h-5 w-5" />
              <span>Veuillez vous connecter à TrueLayer pour voir vos comptes</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Solde total */}
      {accessToken && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span>Solde Total</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBalances(!showBalances)}
                className="ml-auto"
              >
                {showBalances ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {loading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                  <span>Chargement...</span>
                </div>
              ) : (
                showBalances ? formatCurrency(totalBalance) : '••••••'
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {loading ? 'Calcul en cours...' : `Réparti sur ${accounts.length} compte${accounts.length > 1 ? 's' : ''}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Liste des comptes */}
      {accessToken && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <RefreshCw className="h-6 w-6 animate-spin" />
                <span>Chargement des comptes...</span>
              </div>
            </div>
          ) : accounts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <div className="text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun compte trouvé</p>
                <p className="text-sm">Veuillez vous connecter à votre banque</p>
              </div>
            </div>
          ) : (
            accounts.map((account) => {
              const balance = balances.get(account.id);
              return (
                <Card key={account.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {getAccountIcon(account.type)}
                        <div>
                          <CardTitle className="text-lg">{account.name}</CardTitle>
                          <CardDescription>
                            {account.accountNumber}
                            {account.provider && (
                              <span className="ml-2 text-xs text-gray-500">
                                • {account.provider}
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={account.status === 'active' ? 'default' : 'secondary'}>
                        {account.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type</span>
                        <span className="text-sm font-medium">{getAccountTypeLabel(account.type)}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Solde</span>
                        <span className="text-xl font-bold">
                          {showBalances ? formatCurrency(account.balance, account.currency) : '••••••'}
                        </span>
                      </div>

                      {balance && balance.available !== balance.current && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Disponible</span>
                          <span className="text-sm font-medium">
                            {showBalances ? formatCurrency(balance.available, account.currency) : '••••••'}
                          </span>
                        </div>
                      )}

                      {balance && balance.overdraft > 0 && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Découvert</span>
                          <span className="text-sm font-medium text-red-600">
                            {showBalances ? formatCurrency(balance.overdraft, account.currency) : '••••••'}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Dernière mise à jour</span>
                        <span className="text-sm text-gray-500">
                          {account.lastUpdated.toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => setSelectedAccountId(account.id)}
                      >
                        <Receipt className="h-4 w-4 mr-1" />
                        Transactions
                        {transactions.get(account.id) && (
                          <Badge variant="secondary" className="ml-2 text-xs">
                            {transactions.get(account.id)!.length}
                          </Badge>
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => {
                          setSelectedAccountId(account.id);
                          setShowAnalytics(true);
                        }}
                        disabled={!transactions.get(account.id) || transactions.get(account.id)!.length === 0}
                      >
                        <BarChart3 className="h-4 w-4 mr-1" />
                        Analyser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Section des transactions et analyse */}
      {selectedAccountId && (
        <div className="space-y-6">
          {/* En-tête avec navigation */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    {showAnalytics ? (
                      <BarChart3 className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Receipt className="h-5 w-5 text-blue-600" />
                    )}
                    <span>
                      {showAnalytics ? 'Analyse des dépenses' : 'Transactions depuis le 01/01/2025'}
                    </span>
                  </CardTitle>
                  <CardDescription>
                    {accounts.find(a => a.id === selectedAccountId)?.name}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  {!showAnalytics && transactions.get(selectedAccountId) && transactions.get(selectedAccountId)!.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAnalytics(true)}
                    >
                      <BarChart3 className="h-4 w-4 mr-1" />
                      Analyser
                    </Button>
                  )}
                  {showAnalytics && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowAnalytics(false)}
                    >
                      <Receipt className="h-4 w-4 mr-1" />
                      Liste
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedAccountId(null);
                      setShowAnalytics(false);
                    }}
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Contenu : Analyse ou Liste des transactions */}
          {showAnalytics ? (
            <TransactionAnalytics 
              transactions={transactions.get(selectedAccountId) || []}
              accountName={accounts.find(a => a.id === selectedAccountId)?.name || 'Compte'}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                {transactions.get(selectedAccountId) ? (
                  <div className="space-y-3">
                    {transactions.get(selectedAccountId)!.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Aucune transaction trouvée</p>
                        <p className="text-sm">depuis le 01/01/2025</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {transactions.get(selectedAccountId)!.map((transaction, index) => (
                          <div 
                            key={transaction.transaction_id || index}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${
                                  transaction.amount >= 0 ? 'bg-green-500' : 'bg-red-500'
                                }`} />
                                <span className="font-medium">
                                  {transaction.description || transaction.merchant_name || 'Transaction'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{formatDate(transaction.timestamp)}</span>
                                </span>
                                {transaction.transaction_category && (
                                  <Badge variant="outline" className="text-xs">
                                    {transaction.transaction_category}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`font-bold ${
                                transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {formatTransactionAmount(transaction.amount, transaction.currency)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50 animate-spin" />
                    <p>Chargement des transactions...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Statistiques */}
      {accessToken && accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Comptes Courants</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accounts.filter(a => a.type === 'checking').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Comptes Épargne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {accounts.filter(a => a.type === 'savings').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes actifs
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Épargne</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(accounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Sur tous les comptes
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 