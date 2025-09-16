import { Injectable, inject } from '@angular/core';
import { HttpService } from '@pichincha/angular-sdk/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private httpService: HttpService = inject(HttpService);

  private getAuthHeaders(): { [key: string]: string } {
    const token = sessionStorage.getItem(environment.authProvider.accessTokenName);
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  get<T>(url: string): Promise<T> {
    return this.httpService.get(url, null, this.getAuthHeaders());
  }

  post<T>(url: string, body: any): Promise<T> {
    return this.httpService.post(url, body, this.getAuthHeaders());
  }

  put<T>(url: string, body: any): Promise<T> {
    return this.httpService.put(url, body, this.getAuthHeaders());
  }

  patch<T>(url: string, body: any): Promise<T> {
    return this.httpService.patch(url, body, this.getAuthHeaders());
  }

  delete<T>(url: string): Promise<T> {
    return this.httpService.delete(url, this.getAuthHeaders());
  }
}
