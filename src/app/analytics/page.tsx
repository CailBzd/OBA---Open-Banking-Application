'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Calendar,
  DollarSign,
  Target,
  AlertCircle
} from 'lucide-react';

export default function AnalyticsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Analyses Financières</h1>
        <p className="text-gray-600">Graphiques détaillés et tendances de vos finances</p>
      </div>

      {/* Métriques clés */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Croissance Mensuelle</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +2.1% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Dépenses Moyennes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(1850)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="inline h-3 w-3 mr-1" />
              -5.2% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Taux d'Épargne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">38.9%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +1.8% vs mois dernier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Objectifs Atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">3/5</div>
            <p className="text-xs text-muted-foreground">
              <Target className="inline h-3 w-3 mr-1" />
              60% de progression
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Onglets d'analyses */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
          <TabsTrigger value="forecasting">Prévisions</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique des revenus/dépenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>Évolution Revenus vs Dépenses</span>
                </CardTitle>
                <CardDescription>Sur les 12 derniers mois</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Graphique des tendances</p>
                    <p className="text-sm">Intégration des graphiques en cours...</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Graphique de l'épargne */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Progression de l'Épargne</span>
                </CardTitle>
                <CardDescription>Accumulation au fil du temps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Graphique de progression</p>
                    <p className="text-sm">Intégration des graphiques en cours...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="h-5 w-5" />
                <span>Répartition par Catégorie</span>
              </CardTitle>
              <CardDescription>Analyse détaillée des dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Graphique circulaire */}
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center text-gray-500">
                    <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>Graphique circulaire</p>
                    <p className="text-sm">Intégration des graphiques en cours...</p>
                  </div>
                </div>

                {/* Détails des catégories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🍽️</span>
                      <span className="font-medium">Alimentation</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(450)}</div>
                      <Badge variant="outline" className="text-xs">25%</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🚗</span>
                      <span className="font-medium">Transport</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(180)}</div>
                      <Badge variant="outline" className="text-xs">10%</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">🛍️</span>
                      <span className="font-medium">Shopping</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(320)}</div>
                      <Badge variant="outline" className="text-xs">18%</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">💡</span>
                      <span className="font-medium">Factures</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(280)}</div>
                      <Badge variant="outline" className="text-xs">16%</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Prévisions Financières</span>
              </CardTitle>
              <CardDescription>Projections basées sur vos habitudes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">3 mois</div>
                    <div className="text-sm text-gray-600">Épargne estimée</div>
                    <div className="text-lg font-semibold text-blue-800">{formatCurrency(4500)}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">6 mois</div>
                    <div className="text-sm text-gray-600">Épargne estimée</div>
                    <div className="text-lg font-semibold text-green-800">{formatCurrency(9200)}</div>
                  </div>
                  
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">12 mois</div>
                    <div className="text-sm text-gray-600">Épargne estimée</div>
                    <div className="text-lg font-semibold text-purple-800">{formatCurrency(18500)}</div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Recommandation</h4>
                      <p className="text-sm text-yellow-700">
                        En réduisant vos dépenses de shopping de 15%, vous pourriez épargner 
                        {formatCurrency(48)} supplémentaires par mois.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="h-5 w-5" />
                <span>Insights Intelligents</span>
              </CardTitle>
              <CardDescription>Découvertes automatiques sur vos finances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-800">Tendance Positive</h4>
                      <p className="text-sm text-green-700">
                        Votre taux d'épargne a augmenté de 12% ce trimestre. 
                        Continuez sur cette lancée !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Régularité</h4>
                      <p className="text-sm text-blue-700">
                        Vous recevez votre salaire régulièrement le 1er de chaque mois. 
                        Parfait pour la planification !
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-start space-x-2">
                    <Target className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-purple-800">Objectif Atteignable</h4>
                      <p className="text-sm text-purple-700">
                        Avec votre rythme actuel, vous atteindrez votre objectif d'épargne 
                        de {formatCurrency(50000)} en 18 mois.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 