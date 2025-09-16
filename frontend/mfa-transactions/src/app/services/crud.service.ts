import { inject, Injectable } from '@angular/core';
import { HttpService } from '@pichincha/angular-sdk/http';
import { Product, ResponseProduct } from '../interfaces/product.interface';
import { CreateDtoProducto } from '../types/product.type';
import { Transaction, TransactionResponse, UpdateTransactionDto, AccountInfo } from '../interfaces/transaction.interface';
import { AccountResponse, CreateTransactionDto } from '../interfaces/account.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable()
export class CrudService {
  private http: HttpService = inject(HttpService);
  private authService: AuthService = inject(AuthService);

  headers = {
    'x-app': '00738',
    'x-guid': '550e8400-e29b-41d4-a716-446655440000',
    'x-channel': '10',
    'x-medium': '100002',
    'x-session': 'a9fd8deb-2aad-4d88-a7e3-d153c9e44b66',
    'x-device': '9939aadd00ee32',
    'x-device-ip': '200.10.89.34',
    'x-agency': '2188',
    'x-geolocation': '(-0.126076,-78.483371)'
  };

  private getHeaders(): Record<string, string> {
    return {
      ...this.headers,
      ...this.authService.getAuthHeaders()
    };
  }

  getAll(): Promise<ResponseProduct> {
    return this.http.get('products');
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

  getAllTransactions(page: number = 0, limit: number = 10): Promise<TransactionResponse> {
    const params = { page, limit };
    return this.http.get(
      `${environment.depositHost}${environment.transactionPath}/retrieve`,
      params,
      this.getHeaders()
    ).catch((error) => {
      throw error;
    });
  }

  deleteTransaction(transactionId: string): Promise<boolean> {
    return this.http.delete(
      `${environment.depositHost}${environment.transactionPath}/${transactionId}/delete`,
      this.getHeaders()
    );
  }

  // New methods for transaction creation functionality
  getAllAccounts(): Promise<AccountResponse> {
    return this.http.get(
      `${environment.depositHost}${environment.depositPath}/retrieve`,
      { page: null, limit: null },
      this.getHeaders()
    );
  }

  createTransaction(transaction: CreateTransactionDto): Promise<any> {
    return this.http.post(
      `${environment.depositHost}${environment.transactionPath}/register`,
      transaction,
      this.getHeaders()
    );
  }

  // New methods for transaction editing functionality
  getTransactionById(transactionId: string): Promise<Transaction> {
    return this.http.get(
      `${environment.depositHost}${environment.transactionPath}/${transactionId}/retrieve`,
      "",this.getHeaders()
    );
  }

  updateTransaction(transactionId: string, transaction: UpdateTransactionDto): Promise<any> {
    return this.http.put(
      `${environment.depositHost}${environment.transactionPath}/${transactionId}/update`,
      transaction,
      this.getHeaders()
    );
  }

  getAccountInfo(accountNumber: string): Promise<AccountInfo> {
    return this.http.get(
      `${environment.depositHost}${environment.depositPath}/${accountNumber}/retrieve`,
      this.getHeaders()
    );
  }
}
