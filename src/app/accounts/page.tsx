'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, PiggyBank, TrendingUp, Eye, EyeOff, Plus } from 'lucide-react';
import { useState } from 'react';
import { BankAccount } from '@/types/openbanking';

const mockAccounts: BankAccount[] = [
  {
    id: '1',
    name: 'Compte Courant Principal',
    accountNumber: '****1234',
    balance: 15420.50,
    currency: 'EUR',
    type: 'checking',
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: '2',
    name: 'Épargne',
    accountNumber: '****5678',
    balance: 25000,
    currency: 'EUR',
    type: 'savings',
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: '3',
    name: 'Compte Joint',
    accountNumber: '****9012',
    balance: 3200.75,
    currency: 'EUR',
    type: 'checking',
    status: 'active',
    lastUpdated: new Date()
  },
  {
    id: '4',
    name: 'Livret A',
    accountNumber: '****3456',
    balance: 15000,
    currency: 'EUR',
    type: 'savings',
    status: 'active',
    lastUpdated: new Date()
  }
];

export default function AccountsPage() {
  const [showBalances, setShowBalances] = useState(true);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
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

  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Comptes</h1>
          <p className="text-gray-600">Gérez tous vos comptes bancaires</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un compte
        </Button>
      </div>

      {/* Solde total */}
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
            {showBalances ? formatCurrency(totalBalance) : '••••••'}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Réparti sur {mockAccounts.length} compte{mockAccounts.length > 1 ? 's' : ''}
          </p>
        </CardContent>
      </Card>

      {/* Liste des comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getAccountIcon(account.type)}
                  <div>
                    <CardTitle className="text-lg">{account.name}</CardTitle>
                    <CardDescription>{account.accountNumber}</CardDescription>
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
                    {showBalances ? formatCurrency(account.balance) : '••••••'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Dernière mise à jour</span>
                  <span className="text-sm text-gray-500">
                    {account.lastUpdated.toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Voir les transactions
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Paramètres
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Comptes Courants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAccounts.filter(a => a.type === 'checking').length}
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
              {mockAccounts.filter(a => a.type === 'savings').length}
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
              {formatCurrency(mockAccounts.filter(a => a.type === 'savings').reduce((sum, a) => sum + a.balance, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur tous les comptes
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 