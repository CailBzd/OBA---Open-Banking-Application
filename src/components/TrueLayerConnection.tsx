'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Building2, CreditCard, TrendingUp, RefreshCw, LogOut, CheckCircle, AlertCircle } from 'lucide-react';
import { useTrueLayerApi } from '@/hooks/useTrueLayerApi';

export default function TrueLayerConnection() {
  const [clientId, setClientId] = useState('sandbox-openbank-d33846');
  const [clientSecret, setClientSecret] = useState('5fe1e369-e616-4687-9512-767710c2428a');
  const [redirectUri, setRedirectUri] = useState('http://localhost:3000/api/truelayer/callback');

  const {
    loading,
    error,
    accounts,
    balances,
    transactions,
    cards,
    connectBank,
    handleAuthCallback,
    fetchAccounts,
    fetchAccountBalances,
    fetchAccountTransactions,
    fetchAccountCards,
    refreshToken,
    disconnect,
    isConnected,
    authUrl
  } = useTrueLayerApi(clientId, clientSecret, redirectUri);

  // Gérer le callback d'authentification depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const errorParam = urlParams.get('error');

    if (errorParam) {
      console.error('Erreur d\'autorisation:', errorParam);
      return;
    }

    if (authCode && clientId && clientSecret) {
      handleAuthCallback(authCode);
    }
  }, [clientId, clientSecret, handleAuthCallback]);

  // Récupérer les transactions pour un compte
  const handleFetchTransactions = async (accountId: string) => {
    const fromDate = new Date();
    fromDate.setMonth(fromDate.getMonth() - 1); // 1 mois en arrière
    
    await fetchAccountTransactions(
      accountId,
      fromDate.toISOString().split('T')[0],
      new Date().toISOString().split('T')[0]
    );
  };

  // Récupérer les cartes pour un compte
  const handleFetchCards = async (accountId: string) => {
    await fetchAccountCards(accountId);
  };

  if (isConnected) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
                           <h1 className="text-3xl font-bold text-gray-900 mb-2">
                 🏦 Comptes Bancaires Connectés
               </h1>
               <p className="text-gray-600">
                 Vos comptes sont maintenant connectés via OBA et TrueLayer Open Banking
               </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={refreshToken} variant="outline" disabled={loading}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Rafraîchir
            </Button>
            <Button onClick={disconnect} variant="destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnecter
            </Button>
          </div>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (
          <div className="text-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Chargement en cours...</p>
          </div>
        )}

        {accounts.length > 0 && (
          <div className="space-y-6">
            {accounts.map((account) => (
              <Card key={account.account_id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    {account.display_name}
                  </CardTitle>
                  <CardDescription>
                    {account.account_type} • {account.currency} • {account.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {balances[account.account_id]?.map((balance, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600 mb-1">Solde actuel</div>
                        <div className="text-2xl font-bold text-gray-900">
                          {balance.current.toFixed(2)} {balance.currency}
                        </div>
                        <div className="text-sm text-gray-500">
                          Disponible: {balance.available.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mb-4">
                    <Button
                      onClick={() => handleFetchTransactions(account.account_id)}
                      variant="outline"
                      size="sm"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Transactions
                    </Button>
                    <Button
                      onClick={() => handleFetchCards(account.account_id)}
                      variant="outline"
                      size="sm"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Cartes
                    </Button>
                  </div>

                  {/* Transactions */}
                  {transactions[account.account_id] && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Dernières transactions</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {transactions[account.account_id].slice(0, 5).map((transaction) => (
                          <div key={transaction.transaction_id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(transaction.timestamp).toLocaleDateString()}
                              </div>
                            </div>
                            <div className={`font-semibold ${
                              transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} {transaction.currency}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cartes */}
                  {cards[account.account_id] && cards[account.account_id].length > 0 && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">Cartes associées</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {cards[account.account_id].map((card) => (
                          <div key={card.card_id} className="p-3 bg-blue-50 rounded border border-blue-200">
                            <div className="font-medium">{card.name_on_card}</div>
                            <div className="text-sm text-gray-600">
                              {card.card_type} • {card.card_network}
                            </div>
                            <div className="text-sm text-gray-500">
                              Expire: {new Date(card.valid_to).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && accounts.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Connexion réussie !</h3>
              <p className="text-gray-600">
                Votre banque est connectée. Les comptes se chargent automatiquement...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Building2 className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            TrueLayer Open Banking
          </h1>
          <p className="text-xl text-gray-600">
            Connectez vos comptes bancaires européens en toute sécurité
          </p>
        </div>

        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Configuration TrueLayer</CardTitle>
            <CardDescription>
              Entrez vos identifiants TrueLayer pour commencer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Votre Client ID TrueLayer"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="clientSecret">Client Secret</Label>
              <Input
                id="clientSecret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Votre Client Secret TrueLayer"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="redirectUri">URI de redirection</Label>
              <Input
                id="redirectUri"
                value={redirectUri}
                onChange={(e) => setRedirectUri(e.target.value)}
                placeholder="http://localhost:3000/api/truelayer/callback"
                className="mt-1"
              />
              <p className="text-sm text-gray-500 mt-1">
                URL de callback configurée dans votre application TrueLayer
              </p>
            </div>

            <Button
              onClick={connectBank}
              disabled={!clientId || !clientSecret || !redirectUri || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  Se connecter à ma banque
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            🔒 Vos identifiants bancaires ne sont jamais stockés sur nos serveurs.
          </p>
          <p className="mt-1">
            La connexion se fait directement via TrueLayer et votre banque.
          </p>
        </div>
      </div>
    </div>
  );
} 