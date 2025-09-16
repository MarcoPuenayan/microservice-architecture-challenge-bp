import { inject, Injectable } from '@angular/core';
import { Product, ResponseProduct } from '../interfaces/product.interface';
import { Customer, CustomerResponse } from '../interfaces/customer.interface';
import { CreateDtoProducto } from '../types/product.type';
import { CreateCustomerDto, UpdateCustomerDto } from '../types/customer.type';
import { environment } from '../../environments/environment';
import { AuthHttpService } from './auth-http.service';

@Injectable()
export class CrudService {
  private http: AuthHttpService = inject(AuthHttpService);

  getAll(): Promise<ResponseProduct> {
    return this.http.get('products');
  }

  getAllCustomers(page: number = 0, limit: number = 10): Promise<CustomerResponse> {
    return this.http.get(`${environment.customer.host}${environment.customer.path}/retrieve?page=${page}&limit=${limit}`);
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

  createCustomer(customer: CreateCustomerDto): Promise<any> {
    return this.http.post(`${environment.customer.host}${environment.customer.path}/register`, customer);
  }

  deleteCustomer(customerId: string): Promise<any> {
    return this.http.delete(`${environment.customer.host}${environment.customer.path}/${customerId}/delete`);
  }

  updateCustomer(customerId: string, customer: UpdateCustomerDto): Promise<any> {
    return this.http.put(`${environment.customer.host}${environment.customer.path}/${customerId}/update`, customer);
  }

  getCustomerById(customerId: string): Promise<Customer> {
    return this.http.get(`${environment.customer.host}${environment.customer.path}/${customerId}/retrieve`);
  }
}
