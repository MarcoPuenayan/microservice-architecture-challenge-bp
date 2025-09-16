import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let interceptor: AuthInterceptor;

  const mockAuthData = {
    token: 'mock-jwt-token-123'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthInterceptor,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    interceptor = TestBed.inject(AuthInterceptor);
  });

  afterEach(() => {
    httpTestingController.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add Authorization header when auth data exists', () => {
    sessionStorage.setItem('mfe_auth_data', JSON.stringify(mockAuthData));

    httpClient.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeTruthy();
    expect(req.request.headers.get('Authorization')).toBe(`Bearer ${mockAuthData.token}`);
  });

  it('should not add Authorization header when no auth data exists', () => {
    httpClient.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should not add Authorization header when auth data is invalid JSON', () => {
    sessionStorage.setItem('mfe_auth_data', 'invalid-json');

    httpClient.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
  });

  it('should not add Authorization header when token is missing in auth data', () => {
    sessionStorage.setItem('mfe_auth_data', JSON.stringify({}));

    httpClient.get('/test').subscribe();

    const req = httpTestingController.expectOne('/test');
    expect(req.request.headers.has('Authorization')).toBeFalsy();
  });
});
