export interface Account {
  accountNumber: string;
  accountDescription: string;
  accountTypeId: number;
  accountTypeDescription: string;
  balance: number;
  status: boolean;
}

export interface AccountResponse {
  accounts: Account[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface CreateTransactionDto {
  accountNumber: string;
  transactionTypeId: number;
  transactionValue: number;
  transactionDate: string;
}

export interface TransactionType {
  id: number;
  description: string;
}
