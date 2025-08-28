// Types pour l'API TrueLayer Open Banking
// Documentation: https://docs.truelayer.com/

export interface TrueLayerAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface TrueLayerProvider {
  provider_id: string;
  display_name: string;
  logo_uri: string;
  provider_type: string;
  country_code: string;
  capabilities: {
    payments: boolean;
    accounts: boolean;
    cards: boolean;
  };
}

export interface TrueLayerAccount {
  account_id: string;
  account_type: string;
  account_number: {
    iban?: string;
    number?: string;
    sort_code?: string;
  };
  currency: string;
  description: string;
  display_name: string;
  update_timestamp: string;
  provider: {
    provider_id: string;
    display_name: string;
  };
}

export interface TrueLayerBalance {
  account_id: string;
  current: number;
  available: number;
  overdraft: number;
  currency: string;
  update_timestamp: string;
}

export interface TrueLayerTransaction {
  transaction_id: string;
  timestamp: string;
  description: string;
  amount: number;
  currency: string;
  transaction_type: string;
  transaction_category: string;
  merchant_name?: string;
  running_balance?: {
    amount: number;
    currency: string;
  };
  meta?: {
    bank_transaction_id?: string;
    provider_transaction_category?: string;
  };
}

export interface TrueLayerCard {
  card_id: string;
  card_network: string;
  card_type: string;
  currency: string;
  partial_pan: string;
  name_on_card: string;
  valid_from: string;
  valid_to: string;
  update_timestamp: string;
}

export interface TrueLayerDirectDebit {
  direct_debit_id: string;
  name: string;
  previous_payment_date: string;
  previous_payment_amount: number;
  currency: string;
  mandate_id: string;
  status: string;
  next_payment_date?: string;
  next_payment_amount?: number;
}

export interface TrueLayerStandingOrder {
  standing_order_id: string;
  frequency: string;
  next_payment_date: string;
  next_payment_amount: number;
  currency: string;
  reference: string;
  status: string;
}

export interface TrueLayerError {
  error: string;
  error_description?: string;
  error_details?: any;
} 