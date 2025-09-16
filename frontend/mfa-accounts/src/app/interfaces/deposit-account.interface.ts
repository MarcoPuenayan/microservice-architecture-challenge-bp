export interface DepositAccount {
  accountId?: string;
  accountNumber: string;
  accountTypeId: number;
  accountTypeDescription: string;
  initialBalance: number;
  customerId: string;
  customerName: string | null;
  status: boolean;
}

export interface ResponseDepositAccounts {
  accounts: DepositAccount[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
