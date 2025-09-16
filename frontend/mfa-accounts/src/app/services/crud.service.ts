import { inject, Injectable } from '@angular/core';
import { Product, ResponseProduct } from '../interfaces/product.interface';
import { DepositAccount, ResponseDepositAccounts } from '../interfaces/deposit-account.interface';
import { Customer, ResponseCustomer } from '../interfaces/customer.interface';
import { CreateDtoProducto } from '../types/product.type';
import { CreateAccountDto, UpdateAccountDto } from '../types/account.type';
import { environment } from '../../environments/environment';
import { AuthHttpService } from './auth-http.service';

export interface ErrorResponse {
  title: string;
  detail: string;
  instance: string;
  type: string;
  resource: string;
  component: string;
  backend: string;
  errors: Array<{
    code: string;
    message: string;
    businessMessage: string;
  }>;
}

@Injectable()
export class CrudService {
  private http: AuthHttpService = inject(AuthHttpService);

  getAll(): Promise<ResponseProduct> {
    return this.http.get('products');
  }

  getAllDepositAccounts(page: number = 0, limit: number = 5): Promise<ResponseDepositAccounts> {
    const url = `${environment.depositHost}${environment.depositPath}/retrieve?page=${page}&limit=${limit}`;
    return this.http.get(url);
  }

  getAllCustomers(): Promise<ResponseCustomer> {
    const url = `${environment.depositHost}${environment.customerPath}/retrieve?page=0&limit=100`;
    return this.http.get(url);
  }

  createAccount(account: CreateAccountDto): Promise<any> {
    const url = `${environment.depositHost}${environment.depositPath}/register`;
    return this.http.post(url, account);
  }

  getById(idProduct: number): Promise<Product> {
    return this.http.get('products/' + idProduct);
  }

  create(producto: CreateDtoProducto): Promise<boolean> {
    return this.http.post('products/add', producto);
  }

  update(idProduct: number, producto: CreateDtoProducto): Promise<boolean> {
    return this.http.put('products/' + idProduct, producto);
  }

  delete(idProduct: number): Promise<boolean> {
    return this.http.delete('products/' + idProduct);
  }

  deleteDepositAccount(accountId: string): Promise<any> {
    const url = `${environment.depositHost}${environment.depositPath}/${accountId}/delete`;
    return this.http.delete(url);
  }

  getAccountById(accountId: string): Promise<DepositAccount> {
    const url = `${environment.depositHost}${environment.depositPath}/${accountId}/retrieve`;
    return this.http.get(url);
  }

  getCustomerById(customerId: string): Promise<Customer> {
    const url = `${environment.depositHost}${environment.customerPath}/${customerId}/retrieve`;
    return this.http.get(url);
  }

  updateAccount(accountId: string, account: UpdateAccountDto): Promise<any> {
    const url = `${environment.depositHost}${environment.depositPath}/${accountId}/update`;
    return this.http.put(url, account);
  }
}
