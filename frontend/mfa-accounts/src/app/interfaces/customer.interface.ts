export interface Customer {
  customerId: string;
  name: string;
  gender: string;
  age: number;
  identification: string;
  address: string;
  phone: string;
  status: boolean;
}

export interface ResponseCustomer {
  customer: Customer[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
