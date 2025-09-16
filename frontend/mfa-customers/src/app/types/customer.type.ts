export interface CreateCustomerDto {
  name: string;
  gender: string;
  identification: string;
  age: number;
  address: string;
  phone: string;
  password: string;
}

export interface UpdateCustomerDto {
  name: string;
  gender: string;
  identification: string;
  age: number;
  address: string;
  phone: string;
  status: boolean;
}

export interface CustomerErrorResponse {
  title: string;
  detail: string;
  instance: string;
  type: string;
  resource: string;
  component: string;
  backend: string;
  errors: CustomerErrorDetail[];
}

export interface CustomerErrorDetail {
  code: string;
  message: string;
  businessMessage: string;
}
