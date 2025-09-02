// Types pour l'interface utilisateur des comptes bancaires
export interface BankAccount {
  id: string;
  name: string;
  accountNumber: string;
  balance: number;
  currency: string;
  type: 'checking' | 'savings' | 'credit' | 'investment';
  status: 'active' | 'inactive' | 'suspended';
  lastUpdated: Date;
  provider?: string;
  iban?: string;
  availableBalance?: number;
  overdraft?: number;
}
