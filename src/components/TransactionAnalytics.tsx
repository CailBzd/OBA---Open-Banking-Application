'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  PieChart, 
  BarChart3,
  Receipt,
  Target,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { TransactionAnalysis, SpendingInsights } from '@/types/transaction-analysis';
import { TransactionAnalysisService } from '@/lib/transaction-analysis';

interface TransactionAnalyticsProps {
  transactions: any[];
  accountName: string;
}

export default function TransactionAnalytics({ transactions, accountName }: TransactionAnalyticsProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const [showAllTransactions, setShowAllTransactions] = useState(false);

  if (!transactions || transactions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            <span>Analyse des dépenses</span>
          </CardTitle>
          <CardDescription>{accountName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune transaction à analyser</p>
            <p className="text-sm">Les données d'analyse apparaîtront ici</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const analysis = TransactionAnalysisService.analyzeTransactions(transactions);
  const insights = TransactionAnalysisService.generateSpendingInsights(analysis);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'decreasing':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-red-600';
      case 'decreasing':
        return 'text-green-600';
      default:
        return 'text-blue-600';
    }
  };

  const toggleCategoryExpansion = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleMonthExpansion = (month: string) => {
    const newExpanded = new Set(expandedMonths);
    if (newExpanded.has(month)) {
      newExpanded.delete(month);
    } else {
      newExpanded.add(month);
    }
    setExpandedMonths(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Total Entrées</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(analysis.totalIncome)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.topIncome.length} transaction{analysis.topIncome.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span>Total Sorties</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(analysis.totalExpenses)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.categories.filter(c => !c.isIncome).reduce((sum, c) => sum + c.transactionCount, 0)} transaction{analysis.categories.filter(c => !c.isIncome).reduce((sum, c) => sum + c.transactionCount, 0) > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-blue-600" />
              <span>Solde Net</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${analysis.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(analysis.netBalance)}
            </div>
            <p className="text-xs text-muted-foreground">
              {analysis.netBalance >= 0 ? 'Épargne' : 'Déficit'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Insights et recommandations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span>Insights & Recommandations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Moyennes</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Dépense quotidienne moyenne</span>
                    <span className="font-medium">{formatCurrency(insights.averageDailySpending)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Dépense mensuelle moyenne</span>
                    <span className="font-medium">{formatCurrency(insights.averageMonthlySpending)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Tendance</h4>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(insights.spendingTrend)}
                  <span className={`text-sm font-medium ${getTrendColor(insights.spendingTrend)}`}>
                    {insights.spendingTrend === 'increasing' ? 'En augmentation' : 
                     insights.spendingTrend === 'decreasing' ? 'En diminution' : 'Stable'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-sm text-gray-600 mb-2">Top Dépense</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Catégorie principale</span>
                    <Badge variant="outline">{insights.mostExpensiveCategory}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Transaction la plus chère</span>
                    <span className="font-medium text-red-600">
                      {formatCurrency(Math.abs(insights.mostExpensiveTransaction.amount))}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {insights.budgetRecommendation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-800">{insights.budgetRecommendation}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analyse par catégories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <PieChart className="h-5 w-5 text-blue-600" />
            <span>Analyse par Catégories</span>
          </CardTitle>
          <CardDescription>Répartition des dépenses par catégorie</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.categories.slice(0, 8).map((category, index) => (
              <div key={category.category} className="border rounded-lg">
                <div 
                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleCategoryExpansion(category.category)}
                >
                  <div className="flex items-center space-x-3">
                    {expandedCategories.has(category.category) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: TransactionAnalysisService.getCategoryColor(category.category) }}
                    />
                    <div>
                      <div className="font-medium">{category.category}</div>
                      <div className="text-sm text-gray-600">
                        {category.transactionCount} transaction{category.transactionCount > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${category.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(category.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {category.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
                
                {expandedCategories.has(category.category) && (
                  <div className="border-t bg-gray-50 p-3">
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {category.transactions.map((transaction, idx) => (
                        <div key={transaction.id || idx} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{transaction.description}</div>
                            <div className="text-xs text-gray-600">
                              {formatDate(transaction.date)}
                              {transaction.merchant && ` • ${transaction.merchant}`}
                            </div>
                          </div>
                          <div className={`font-bold text-sm ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(transaction.amount)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analyse mensuelle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Évolution Mensuelle</span>
          </CardTitle>
          <CardDescription>Comparaison des mois</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis.monthlyData.slice(0, 6).map((month) => (
              <div key={month.month} className="border rounded-lg">
                <div 
                  className="p-4 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleMonthExpansion(month.month)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {expandedMonths.has(month.month) ? (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-500" />
                      )}
                      <h4 className="font-medium">{month.monthName}</h4>
                    </div>
                    <Badge variant={month.netBalance >= 0 ? 'default' : 'destructive'}>
                      {formatCurrency(month.netBalance)}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Entrées:</span>
                      <span className="ml-2 font-medium text-green-600">
                        {formatCurrency(month.totalIncome)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Sorties:</span>
                      <span className="ml-2 font-medium text-red-600">
                        {formatCurrency(month.totalExpenses)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    {month.transactionCount} transaction{month.transactionCount > 1 ? 's' : ''}
                  </div>
                </div>
                
                {expandedMonths.has(month.month) && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="space-y-4">
                      {/* Catégories du mois */}
                      <div>
                        <h5 className="font-medium text-sm mb-2">Répartition par catégorie</h5>
                        <div className="space-y-2">
                          {month.categories.slice(0, 5).map((category) => (
                            <div key={category.category} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: TransactionAnalysisService.getCategoryColor(category.category) }}
                                />
                                <span className="text-sm font-medium">{category.category}</span>
                              </div>
                              <div className="text-right">
                                <div className={`text-sm font-bold ${category.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(category.totalAmount)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {category.transactionCount} transaction{category.transactionCount > 1 ? 's' : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Toutes les transactions du mois */}
                      <div>
                        <h5 className="font-medium text-sm mb-2">Toutes les transactions</h5>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                          {month.categories.flatMap(cat => cat.transactions)
                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                            .map((transaction, idx) => (
                            <div key={transaction.id || idx} className="flex items-center justify-between p-2 bg-white rounded border">
                              <div className="flex-1">
                                <div className="font-medium text-sm">{transaction.description}</div>
                                <div className="text-xs text-gray-600">
                                  {formatDate(transaction.date)}
                                  {transaction.merchant && ` • ${transaction.merchant}`}
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`font-bold text-sm ${transaction.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                  {formatCurrency(transaction.amount)}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {transaction.category}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
