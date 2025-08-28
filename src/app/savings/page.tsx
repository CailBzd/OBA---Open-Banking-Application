'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PiggyBank, 
  TrendingUp, 
  Target, 
  Plus,
  Calendar,
  DollarSign
} from 'lucide-react';

const mockSavingsGoals = [
  {
    id: '1',
    name: 'Voyage en Asie',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: '2024-12-31',
    category: 'travel'
  },
  {
    id: '2',
    name: 'Achat immobilier',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: '2026-06-30',
    category: 'property'
  },
  {
    id: '3',
    name: 'Voiture électrique',
    targetAmount: 25000,
    currentAmount: 8000,
    deadline: '2025-12-31',
    category: 'vehicle'
  }
];

export default function SavingsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      travel: '✈️',
      property: '🏠',
      vehicle: '🚗',
      emergency: '🆘',
      retirement: '🌅'
    };
    return icons[category] || '💰';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      travel: 'bg-blue-100 text-blue-800',
      property: 'bg-green-100 text-green-800',
      vehicle: 'bg-purple-100 text-purple-800',
      emergency: 'bg-red-100 text-red-800',
      retirement: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const totalTarget = mockSavingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const totalCurrent = mockSavingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalProgress = (totalCurrent / totalTarget) * 100;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mon Épargne</h1>
          <p className="text-gray-600">Suivez vos objectifs d'épargne et votre progression</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel objectif
        </Button>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Épargné</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalCurrent)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sur {formatCurrency(totalTarget)} d'objectifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progression Globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalProgress.toFixed(1)}%
            </div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Objectifs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockSavingsGoals.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Objectifs en cours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Objectifs d'épargne */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Mes Objectifs d'Épargne</span>
          </CardTitle>
          <CardDescription>Suivez votre progression vers vos objectifs financiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {mockSavingsGoals.map((goal) => {
              const progress = (goal.currentAmount / goal.targetAmount) * 100;
              const remaining = goal.targetAmount - goal.currentAmount;
              const monthsToDeadline = Math.ceil(
                (new Date(goal.deadline).getTime() - new Date().getTime()) / 
                (1000 * 60 * 60 * 24 * 30)
              );

              return (
                <div key={goal.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                      <div>
                        <h3 className="font-semibold text-lg">{goal.name}</h3>
                        <Badge variant="outline" className={getCategoryColor(goal.category)}>
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {formatCurrency(goal.currentAmount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        sur {formatCurrency(goal.targetAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progression</span>
                      <span className="font-medium">{progress.toFixed(1)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Reste à épargner</span>
                        <div className="font-semibold text-red-600">
                          {formatCurrency(remaining)}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Échéance</span>
                        <div className="font-semibold">
                          {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="text-sm text-gray-500">
                        <Calendar className="inline h-4 w-4 mr-1" />
                        {monthsToDeadline} mois restants
                      </div>
                      <div className="text-sm text-gray-500">
                        <DollarSign className="inline h-4 w-4 mr-1" />
                        {formatCurrency(remaining / Math.max(monthsToDeadline, 1))}/mois
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Conseils d'épargne */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Conseils pour Épargner Plus</span>
          </CardTitle>
          <CardDescription>Optimisez votre épargne avec nos recommandations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Règle des 50/30/20</h4>
              <p className="text-sm text-blue-700">
                50% pour les besoins essentiels, 30% pour les envies, 20% pour l'épargne
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Épargne Automatique</h4>
              <p className="text-sm text-green-700">
                Programmez un virement automatique dès réception de votre salaire
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">Objectifs SMART</h4>
              <p className="text-sm text-purple-700">
                Définissez des objectifs Spécifiques, Mesurables, Atteignables, Réalistes et Temporels
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">Fonds d'Urgence</h4>
              <p className="text-sm text-orange-700">
                Épargnez 3 à 6 mois de dépenses pour faire face aux imprévus
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 