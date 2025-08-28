'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  Plus,
  Calendar,
  DollarSign,
  CheckCircle,
  Clock
} from 'lucide-react';

const mockGoals = [
  {
    id: '1',
    name: 'Voyage en Asie',
    description: 'Visiter le Japon, la Corée et la Thaïlande',
    targetAmount: 5000,
    currentAmount: 3200,
    deadline: '2024-12-31',
    category: 'travel',
    status: 'in-progress'
  },
  {
    id: '2',
    name: 'Achat immobilier',
    description: 'Apport pour une maison de 200m²',
    targetAmount: 50000,
    currentAmount: 15000,
    deadline: '2026-06-30',
    category: 'property',
    status: 'in-progress'
  },
  {
    id: '3',
    name: 'Voiture électrique',
    description: 'Tesla Model 3 ou équivalent',
    targetAmount: 25000,
    currentAmount: 25000,
    deadline: '2025-12-31',
    category: 'vehicle',
    status: 'completed'
  },
  {
    id: '4',
    name: 'Formation continue',
    description: 'Master en Data Science',
    targetAmount: 15000,
    currentAmount: 8000,
    deadline: '2025-06-30',
    category: 'education',
    status: 'in-progress'
  }
];

export default function GoalsPage() {
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
      education: '📚',
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
      education: 'bg-indigo-100 text-indigo-800',
      emergency: 'bg-red-100 text-red-800',
      retirement: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    }
    return <Clock className="h-5 w-5 text-blue-600" />;
  };

  const getStatusText = (status: string) => {
    if (status === 'completed') {
      return 'Atteint';
    }
    return 'En cours';
  };

  const getStatusColor = (status: string) => {
    if (status === 'completed') {
      return 'bg-green-100 text-green-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  const completedGoals = mockGoals.filter(goal => goal.status === 'completed');
  const inProgressGoals = mockGoals.filter(goal => goal.status === 'in-progress');
  const totalProgress = mockGoals.reduce((sum, goal) => sum + (goal.currentAmount / goal.targetAmount), 0) / mockGoals.length * 100;

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Objectifs Financiers</h1>
          <p className="text-gray-600">Définissez et suivez vos objectifs financiers</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel objectif
        </Button>
      </div>

      {/* Vue d'ensemble */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total des Objectifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Objectifs définis
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              {((completedGoals.length / mockGoals.length) * 100).toFixed(0)}% de réussite
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{inProgressGoals.length}</div>
            <p className="text-xs text-muted-foreground">
              Objectifs actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progression Globale</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {totalProgress.toFixed(1)}%
            </div>
            <Progress value={totalProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Objectifs en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Objectifs en Cours</span>
          </CardTitle>
          <CardDescription>Continuez sur la bonne voie !</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {inProgressGoals.map((goal) => {
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
                        <p className="text-sm text-gray-600">{goal.description}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className={getCategoryColor(goal.category)}>
                            {goal.category}
                          </Badge>
                          <Badge variant="outline" className={getStatusColor(goal.status)}>
                            {getStatusIcon(goal.status)}
                            <span className="ml-1">{getStatusText(goal.status)}</span>
                          </Badge>
                        </div>
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

      {/* Objectifs atteints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5" />
            <span>Objectifs Atteints</span>
          </CardTitle>
          <CardDescription>Félicitations pour vos réussites !</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(goal.category)}</span>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                    <Badge variant="outline" className={getCategoryColor(goal.category)}>
                      {goal.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(goal.targetAmount)}
                  </div>
                  <div className="text-sm text-green-600">
                    <CheckCircle className="inline h-4 w-4 mr-1" />
                    Atteint le {new Date(goal.deadline).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils pour atteindre ses objectifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Comment Atteindre Vos Objectifs</span>
          </CardTitle>
          <CardDescription>Stratégies pour réussir vos objectifs financiers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">1. Définir des Objectifs SMART</h4>
              <p className="text-sm text-blue-700">
                Spécifiques, Mesurables, Atteignables, Réalistes et Temporels
              </p>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">2. Suivre Régulièrement</h4>
              <p className="text-sm text-green-700">
                Vérifiez votre progression chaque semaine et ajustez si nécessaire
              </p>
            </div>
            
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-2">3. Automatiser l'Épargne</h4>
              <p className="text-sm text-purple-700">
                Programmez des virements automatiques pour ne jamais oublier
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-800 mb-2">4. Célébrer les Petites Victoires</h4>
              <p className="text-sm text-orange-700">
                Récompensez-vous à chaque étape importante atteinte
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 