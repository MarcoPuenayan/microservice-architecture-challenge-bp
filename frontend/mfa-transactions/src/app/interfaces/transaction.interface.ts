export interface Transaction {
  transactionId: string;
  accountNumber: string;
  accountDescription: string | null;
  transactionTypeId: number;
  transactionTypeDescription: string;
  transactionValue: number;
  balance: number;
  transactionDate: string;
  status: boolean;
}

export interface TransactionResponse {
  transactions: Transaction[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UpdateTransactionDto {
  accountNumber: string;
  transactionTypeId: string;
  transactionValue: string;
  balance: string;
  transactionDate: string;
  status: boolean;
}

export interface AccountInfo {
  accountNumber: string;
  accountDescription: string;
}
