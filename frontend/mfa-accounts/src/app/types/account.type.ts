export interface CreateAccountDto {
  accountNumber: string;
  accountTypeId: number;
  initialBalance: number;
  customerId: string;
}

export interface UpdateAccountDto {
  accountNumber: string;
  accountTypeId: number;
  initialBalance: number;
  customerId: string;
  status: boolean;
}

export interface AccountType {
  id: number;
  description: string;
}
