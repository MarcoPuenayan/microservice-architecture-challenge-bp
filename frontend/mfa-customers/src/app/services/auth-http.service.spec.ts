import { TestBed } from '@angular/core/testing';
import { HttpService } from '@pichincha/angular-sdk/http';
import { AuthHttpService } from './auth-http.service';
import { environment } from '../../environments/environment';

describe('AuthHttpService', () => {
  let service: AuthHttpService;
  let mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthHttpService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    });
    service = TestBed.inject(AuthHttpService);
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add Authorization header when token exists in sessionStorage for GET request', async () => {
    const testToken = 'test-jwt-token';
    sessionStorage.setItem(environment.authProvider.accessTokenName, testToken);
    mockHttpService.get.mockResolvedValue('success');

    await service.get('/test');

    expect(mockHttpService.get).toHaveBeenCalledWith('/test', {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
  });

  it('should not add Authorization header when token does not exist in sessionStorage for GET request', async () => {
    mockHttpService.get.mockResolvedValue('success');

    await service.get('/test');

    expect(mockHttpService.get).toHaveBeenCalledWith('/test', {
      headers: {}
    });
  });

  it('should add Authorization header for POST request', async () => {
    const testToken = 'test-jwt-token';
    const testData = { test: 'data' };
    sessionStorage.setItem(environment.authProvider.accessTokenName, testToken);
    mockHttpService.post.mockResolvedValue('success');

    await service.post('/test', testData);

    expect(mockHttpService.post).toHaveBeenCalledWith('/test', testData, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
  });

  it('should add Authorization header for PUT request', async () => {
    const testToken = 'test-jwt-token';
    const testData = { test: 'data' };
    sessionStorage.setItem(environment.authProvider.accessTokenName, testToken);
    mockHttpService.put.mockResolvedValue('success');

    await service.put('/test', testData);

    expect(mockHttpService.put).toHaveBeenCalledWith('/test', testData, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
  });

  it('should add Authorization header for PATCH request', async () => {
    const testToken = 'test-jwt-token';
    const testData = { test: 'data' };
    sessionStorage.setItem(environment.authProvider.accessTokenName, testToken);
    mockHttpService.patch.mockResolvedValue('success');

    await service.patch('/test', testData);

    expect(mockHttpService.patch).toHaveBeenCalledWith('/test', testData, {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
  });

  it('should add Authorization header for DELETE request', async () => {
    const testToken = 'test-jwt-token';
    sessionStorage.setItem(environment.authProvider.accessTokenName, testToken);
    mockHttpService.delete.mockResolvedValue('success');

    await service.delete('/test');

    expect(mockHttpService.delete).toHaveBeenCalledWith('/test', {
      headers: { 'Authorization': `Bearer ${testToken}` }
    });
  });
});
