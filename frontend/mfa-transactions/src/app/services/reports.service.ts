import { Injectable, inject } from '@angular/core';
import { HttpService } from '@pichincha/angular-sdk/http';
import { Observable } from 'rxjs';
import { Customer, CustomerResponse } from '../interfaces/customer.interface';
import { ReportResponse } from '../interfaces/report.interface';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private http: HttpService = inject(HttpService);
  private authService: AuthService = inject(AuthService);

  private readonly headers = {
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

  getCustomers(): Observable<Customer[]> {
    const params = { page: 0, limit: 100 };
    return new Observable(observer => {
      this.http.get(
        `${environment.depositHost}${environment.customerPath}/retrieve`,
        params,
        this.getHeaders()
      ).then((response: CustomerResponse) => {
        observer.next(response.customer || []);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getTransactionReport(customerId: string, startDate: string, endDate: string): Observable<ReportResponse> {
    const params = { customerId, startDate, endDate };
    return new Observable(observer => {
      this.http.get(
        `${environment.depositHost}${environment.transactionPath}/report-retrieve`,
        params,
        this.getHeaders()
      ).then((response: ReportResponse) => {
        observer.next(response);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }

  getTransactionReportPDF(customerId: string, startDate: string, endDate: string): Observable<ReportResponse> {
    const params = { customerId, startDate, endDate, format: 'PDF' };
    return new Observable(observer => {
      this.http.get(
        `${environment.depositHost}${environment.transactionPath}/report-retrieve`,
        params,
        this.getHeaders()
      ).then((response: ReportResponse) => {
        observer.next(response);
        observer.complete();
      }).catch(error => {
        observer.error(error);
      });
    });
  }
}
