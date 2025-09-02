import { TrueLayerTransaction } from '@/types/truelayer-api';
import { 
  TransactionAnalysis, 
  CategoryAnalysis, 
  MonthlyAnalysis, 
  TransactionSummary,
  SpendingInsights,
  CATEGORY_TRANSLATIONS,
  CATEGORY_COLORS
} from '@/types/transaction-analysis';

export class TransactionAnalysisService {
  
  /**
   * Analyser toutes les transactions et générer des insights
   */
  static analyzeTransactions(transactions: TrueLayerTransaction[]): TransactionAnalysis {
    if (!transactions || transactions.length === 0) {
      return TransactionAnalysisService.getEmptyAnalysis();
    }

    // Convertir les transactions TrueLayer en format d'analyse
    const transactionSummaries = transactions.map(TransactionAnalysisService.convertToSummary);
    
    // Séparer les entrées et sorties
    const income = transactionSummaries.filter(t => t.isIncome);
    const expenses = transactionSummaries.filter(t => !t.isIncome);
    
    // Calculer les totaux
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netBalance = totalIncome - totalExpenses;
    
    // Analyser par catégories
    const categories = TransactionAnalysisService.analyzeByCategories(transactionSummaries, totalIncome, totalExpenses);
    
    // Analyser par mois
    const monthlyData = TransactionAnalysisService.analyzeByMonths(transactionSummaries);
    
    // Top transactions
    const topExpenses = expenses
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 5);
    
    const topIncome = income
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalIncome,
      totalExpenses,
      netBalance,
      categories,
      monthlyData,
      topExpenses,
      topIncome
    };
  }

  /**
   * Convertir une transaction TrueLayer en format d'analyse
   */
  private static convertToSummary(transaction: TrueLayerTransaction): TransactionSummary {
    const isIncome = transaction.amount > 0;
    const category = TransactionAnalysisService.normalizeCategory(transaction.transaction_category);
    
    return {
      id: transaction.transaction_id,
      description: transaction.description || 'Transaction',
      amount: transaction.amount,
      date: transaction.timestamp,
      category,
      merchant: transaction.merchant_name,
      isIncome
    };
  }

  /**
   * Normaliser et traduire les catégories
   */
  private static normalizeCategory(category?: string): string {
    if (!category) return 'other';
    
    const normalized = category.toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
    
    return CATEGORY_TRANSLATIONS[normalized] || normalized;
  }

  /**
   * Analyser les transactions par catégories
   */
  private static analyzeByCategories(
    transactions: TransactionSummary[], 
    totalIncome: number, 
    totalExpenses: number
  ): CategoryAnalysis[] {
    const categoryMap = new Map<string, TransactionSummary[]>();
    
    // Grouper par catégorie
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoryMap.has(category)) {
        categoryMap.set(category, []);
      }
      categoryMap.get(category)!.push(transaction);
    });
    
    // Analyser chaque catégorie
    const categories: CategoryAnalysis[] = [];
    
    categoryMap.forEach((categoryTransactions, category) => {
      const totalAmount = categoryTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const isIncome = categoryTransactions[0].isIncome;
      const percentage = isIncome 
        ? (totalAmount / totalIncome) * 100 
        : (totalAmount / totalExpenses) * 100;
      
      categories.push({
        category,
        totalAmount,
        transactionCount: categoryTransactions.length,
        percentage: Math.round(percentage * 100) / 100,
        averageAmount: Math.round((totalAmount / categoryTransactions.length) * 100) / 100,
        transactions: categoryTransactions,
        isIncome
      });
    });
    
    // Trier par montant décroissant
    return categories.sort((a, b) => b.totalAmount - a.totalAmount);
  }

  /**
   * Analyser les transactions par mois
   */
  private static analyzeByMonths(transactions: TransactionSummary[]): MonthlyAnalysis[] {
    const monthMap = new Map<string, TransactionSummary[]>();
    
    // Grouper par mois
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, []);
      }
      monthMap.get(monthKey)!.push(transaction);
    });
    
    // Analyser chaque mois
    const monthlyData: MonthlyAnalysis[] = [];
    
    monthMap.forEach((monthTransactions, monthKey) => {
      const income = monthTransactions.filter(t => t.isIncome);
      const expenses = monthTransactions.filter(t => !t.isIncome);
      
      const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = expenses.reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const netBalance = totalIncome - totalExpenses;
      
      const date = new Date(monthKey + '-01');
      const monthName = date.toLocaleDateString('fr-FR', { 
        month: 'long', 
        year: 'numeric' 
      });
      
      // Analyser les catégories pour ce mois
      const categories = TransactionAnalysisService.analyzeByCategories(monthTransactions, totalIncome, totalExpenses);
      
      monthlyData.push({
        month: monthKey,
        monthName,
        totalIncome,
        totalExpenses,
        netBalance,
        categories,
        transactionCount: monthTransactions.length
      });
    });
    
    // Trier par mois décroissant
    return monthlyData.sort((a, b) => b.month.localeCompare(a.month));
  }

  /**
   * Générer des insights sur les dépenses
   */
  static generateSpendingInsights(analysis: TransactionAnalysis): SpendingInsights {
    const { totalExpenses, categories, monthlyData } = analysis;
    
    // Calculer les moyennes
    const daysInPeriod = TransactionAnalysisService.calculateDaysInPeriod(monthlyData);
    const monthsInPeriod = monthlyData.length;
    
    const averageDailySpending = daysInPeriod > 0 ? totalExpenses / daysInPeriod : 0;
    const averageMonthlySpending = monthsInPeriod > 0 ? totalExpenses / monthsInPeriod : 0;
    
    // Trouver la catégorie la plus chère
    const expenseCategories = categories.filter(c => !c.isIncome);
    const mostExpensiveCategory = expenseCategories[0]?.category || 'Aucune';
    
    // Trouver la transaction la plus chère
    const allExpenses = expenseCategories.flatMap(c => c.transactions);
    const mostExpensiveTransaction = allExpenses
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))[0] || 
      { id: '', description: 'Aucune', amount: 0, date: '', category: '', isIncome: false };
    
    // Analyser la tendance
    const spendingTrend = TransactionAnalysisService.analyzeSpendingTrend(monthlyData);
    
    // Recommandation de budget
    const budgetRecommendation = TransactionAnalysisService.generateBudgetRecommendation(
      averageMonthlySpending, 
      spendingTrend, 
      mostExpensiveCategory
    );
    
    return {
      averageDailySpending: Math.round(averageDailySpending * 100) / 100,
      averageMonthlySpending: Math.round(averageMonthlySpending * 100) / 100,
      mostExpensiveCategory,
      mostExpensiveTransaction,
      spendingTrend,
      budgetRecommendation
    };
  }

  /**
   * Calculer le nombre de jours dans la période
   */
  private static calculateDaysInPeriod(monthlyData: MonthlyAnalysis[]): number {
    if (monthlyData.length === 0) return 0;
    
    const firstMonth = monthlyData[monthlyData.length - 1].month;
    const lastMonth = monthlyData[0].month;
    
    const startDate = new Date(firstMonth + '-01');
    const endDate = new Date(lastMonth + '-01');
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0); // Dernier jour du mois
    
    const diffTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Analyser la tendance des dépenses
   */
  private static analyzeSpendingTrend(monthlyData: MonthlyAnalysis[]): 'increasing' | 'decreasing' | 'stable' {
    if (monthlyData.length < 2) return 'stable';
    
    const recent = monthlyData.slice(0, 2);
    const older = monthlyData.slice(2, 4);
    
    if (recent.length < 2 || older.length < 2) return 'stable';
    
    const recentAvg = (recent[0].totalExpenses + recent[1].totalExpenses) / 2;
    const olderAvg = (older[0].totalExpenses + older[1].totalExpenses) / 2;
    
    const change = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    if (change > 10) return 'increasing';
    if (change < -10) return 'decreasing';
    return 'stable';
  }

  /**
   * Générer une recommandation de budget
   */
  private static generateBudgetRecommendation(
    averageMonthlySpending: number, 
    trend: string, 
    topCategory: string
  ): string {
    if (trend === 'increasing') {
      return `Vos dépenses augmentent. Considérez réduire vos dépenses en ${topCategory}.`;
    } else if (trend === 'decreasing') {
      return `Excellent ! Vos dépenses diminuent. Continuez à économiser.`;
    } else {
      return `Vos dépenses sont stables. Budget mensuel recommandé: ${Math.round(averageMonthlySpending * 1.1)}€.`;
    }
  }

  /**
   * Retourner une analyse vide
   */
  private static getEmptyAnalysis(): TransactionAnalysis {
    return {
      totalIncome: 0,
      totalExpenses: 0,
      netBalance: 0,
      categories: [],
      monthlyData: [],
      topExpenses: [],
      topIncome: []
    };
  }

  /**
   * Obtenir la couleur d'une catégorie
   */
  static getCategoryColor(category: string): string {
    return CATEGORY_COLORS[category.toLowerCase()] || CATEGORY_COLORS['other'];
  }
}
