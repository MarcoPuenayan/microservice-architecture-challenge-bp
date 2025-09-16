import { TestBed } from '@angular/core/testing';
import { ReportsService } from './reports.service';
import { HttpService } from '@pichincha/angular-sdk/http';
import { Customer } from '../interfaces/customer.interface';
import { ReportResponse } from '../interfaces/report.interface';

describe('ReportsService', () => {
  let service: ReportsService;
  let mockHttpService: any;

  const mockCustomerResponse = {
    customers: [
      { customerId: '1', name: 'John Doe', email: 'john@example.com' },
      { customerId: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  };

  const mockReportResponse: ReportResponse = {
    transactions: [
      {
        transactionId: '1',
        accountNumber: '123456789',
        accountDescription: 'Cuenta Corriente',
        transactionTypeId: 1,
        transactionTypeDescription: 'Depósito',
        transactionValue: 1000,
        balance: 2000,
        transactionDate: '2024-01-15T10:30:00',
        status: true
      }
    ]
  };

  beforeEach(() => {
    const httpServiceSpy = jasmine.createSpyObj('HttpService', ['get']);

    TestBed.configureTestingModule({
      providers: [
        ReportsService,
        { provide: HttpService, useValue: httpServiceSpy }
      ]
    });

    service = TestBed.inject(ReportsService);
    mockHttpService = TestBed.inject(HttpService) as any;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch customers', (done) => {
    mockHttpService.get.and.returnValue(Promise.resolve(mockCustomerResponse));

    service.getCustomers().subscribe(customers => {
      expect(customers).toEqual(mockCustomerResponse.customers);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:8098/customer/domain/customer-profile/v1/customer-profiles/retrieve',
        { page: 0, limit: 100 },
        jasmine.any(Object)
      );
      done();
    });
  });

  it('should handle customers fetch error', (done) => {
    mockHttpService.get.and.returnValue(Promise.reject('Error fetching customers'));

    service.getCustomers().subscribe({
      error: (error) => {
        expect(error).toBe('Error fetching customers');
        done();
      }
    });
  });

  it('should fetch transaction report', (done) => {
    mockHttpService.get.and.returnValue(Promise.resolve(mockReportResponse));

    service.getTransactionReport('1', '2024-01-01', '2024-01-31').subscribe(response => {
      expect(response).toEqual(mockReportResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:8098/transactions/domain/current-accounts/v1/account-transactions/report-retrieve',
        { customerId: '1', startDate: '2024-01-01', endDate: '2024-01-31' },
        jasmine.any(Object)
      );
      done();
    });
  });

  it('should fetch transaction report PDF', (done) => {
    const mockPdfResponse = { ...mockReportResponse, pdfReport: 'base64string' };
    mockHttpService.get.and.returnValue(Promise.resolve(mockPdfResponse));

    service.getTransactionReportPDF('1', '2024-01-01', '2024-01-31').subscribe(response => {
      expect(response).toEqual(mockPdfResponse);
      expect(mockHttpService.get).toHaveBeenCalledWith(
        'http://localhost:8098/transactions/domain/current-accounts/v1/account-transactions/report-retrieve',
        { customerId: '1', startDate: '2024-01-01', endDate: '2024-01-31', format: 'PDF' },
        jasmine.any(Object)
      );
      done();
    });
  });

  it('should handle transaction report error', (done) => {
    mockHttpService.get.and.returnValue(Promise.reject('Error fetching report'));

    service.getTransactionReport('1', '2024-01-01', '2024-01-31').subscribe({
      error: (error) => {
        expect(error).toBe('Error fetching report');
        done();
      }
    });
  });
});
