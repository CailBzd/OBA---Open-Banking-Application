// Types pour l'analyse des transactions
export interface TransactionAnalysis {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categories: CategoryAnalysis[];
  monthlyData: MonthlyAnalysis[];
  topExpenses: TransactionSummary[];
  topIncome: TransactionSummary[];
}

export interface CategoryAnalysis {
  category: string;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
  averageAmount: number;
  transactions: TransactionSummary[];
  isIncome: boolean;
}

export interface MonthlyAnalysis {
  month: string; // Format: "2024-01"
  monthName: string; // Format: "Janvier 2024"
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categories: CategoryAnalysis[];
  transactionCount: number;
}

export interface TransactionSummary {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  merchant?: string;
  isIncome: boolean;
}

export interface SpendingInsights {
  averageDailySpending: number;
  averageMonthlySpending: number;
  mostExpensiveCategory: string;
  mostExpensiveTransaction: TransactionSummary;
  spendingTrend: 'increasing' | 'decreasing' | 'stable';
  budgetRecommendation?: string;
}

// Catégories prédéfinies avec leurs traductions
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  'groceries': 'Courses',
  'shopping': 'Shopping',
  'transport': 'Transport',
  'fuel': 'Carburant',
  'parking': 'Stationnement',
  'public_transport': 'Transport public',
  'taxi': 'Taxi',
  'entertainment': 'Loisirs',
  'restaurants': 'Restaurants',
  'food_delivery': 'Livraison de nourriture',
  'healthcare': 'Santé',
  'pharmacy': 'Pharmacie',
  'utilities': 'Services publics',
  'electricity': 'Électricité',
  'gas': 'Gaz',
  'water': 'Eau',
  'internet': 'Internet',
  'phone': 'Téléphone',
  'insurance': 'Assurance',
  'banking': 'Banque',
  'fees': 'Frais bancaires',
  'salary': 'Salaire',
  'pension': 'Retraite',
  'benefits': 'Prestations',
  'investment': 'Investissement',
  'savings': 'Épargne',
  'transfer': 'Virement',
  'cash': 'Espèces',
  'atm': 'Distributeur',
  'other': 'Autre'
};

// Couleurs pour les catégories
export const CATEGORY_COLORS: Record<string, string> = {
  'groceries': '#10B981', // Vert
  'shopping': '#8B5CF6', // Violet
  'transport': '#F59E0B', // Orange
  'fuel': '#EF4444', // Rouge
  'entertainment': '#EC4899', // Rose
  'restaurants': '#F97316', // Orange foncé
  'healthcare': '#06B6D4', // Cyan
  'utilities': '#84CC16', // Vert lime
  'insurance': '#6366F1', // Indigo
  'banking': '#64748B', // Slate
  'salary': '#10B981', // Vert
  'investment': '#8B5CF6', // Violet
  'other': '#6B7280' // Gris
};
