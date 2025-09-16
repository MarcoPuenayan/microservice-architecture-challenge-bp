export interface Customer {
  customerId: string;
  name: string;
  gender?: string;
  age?: number;
  identification?: string;
  address?: string;
  phone?: string;
  status?: boolean;
  // Keeping legacy properties for backward compatibility
  email?: string;
  documentType?: string;
  documentNumber?: string;
}

export interface CustomerResponse {
  customer: Customer[]; // API returns 'customer' not 'customers'
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
