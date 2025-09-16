import { TestBed } from '@angular/core/testing';
import { AuthHttpService } from './auth-http.service';
import { HttpService } from '@pichincha/angular-sdk/http';

describe('AuthHttpService', () => {
  let service: AuthHttpService;
  let mockHttpService = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthHttpService,
        { provide: HttpService, useValue: mockHttpService },
      ],
    });
    service = TestBed.inject(AuthHttpService);
  });

  afterEach(() => {
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('GET requests', () => {
    it('should add Authorization header when token exists', async () => {
      const testToken = 'test-jwt-token';
      sessionStorage.setItem('auth_token', testToken);
      mockHttpService.get.mockResolvedValue({});

      await service.get('/test');

      expect(mockHttpService.get).toHaveBeenCalledWith('/test', {
        Authorization: `Bearer ${testToken}`
      });
    });

    it('should not add Authorization header when token does not exist', async () => {
      mockHttpService.get.mockResolvedValue({});

      await service.get('/test');

      expect(mockHttpService.get).toHaveBeenCalledWith('/test', {});
    });

    it('should merge custom headers with auth headers', async () => {
      const testToken = 'test-jwt-token';
      sessionStorage.setItem('auth_token', testToken);
      mockHttpService.get.mockResolvedValue({});

      await service.get('/test', { 'Custom-Header': 'custom-value' });

      expect(mockHttpService.get).toHaveBeenCalledWith('/test', {
        Authorization: `Bearer ${testToken}`,
        'Custom-Header': 'custom-value'
      });
    });
  });

  describe('POST requests', () => {
    it('should add Authorization header when token exists', async () => {
      const testToken = 'test-jwt-token';
      sessionStorage.setItem('auth_token', testToken);
      mockHttpService.post.mockResolvedValue({});

      await service.post('/test', { data: 'test' });

      expect(mockHttpService.post).toHaveBeenCalledWith('/test', { data: 'test' }, {
        Authorization: `Bearer ${testToken}`
      });
    });
  });

  describe('PUT requests', () => {
    it('should add Authorization header when token exists', async () => {
      const testToken = 'test-jwt-token';
      sessionStorage.setItem('auth_token', testToken);
      mockHttpService.put.mockResolvedValue({});

      await service.put('/test', { data: 'test' });

      expect(mockHttpService.put).toHaveBeenCalledWith('/test', { data: 'test' }, {
        Authorization: `Bearer ${testToken}`
      });
    });
  });

  describe('DELETE requests', () => {
    it('should add Authorization header when token exists', async () => {
      const testToken = 'test-jwt-token';
      sessionStorage.setItem('auth_token', testToken);
      mockHttpService.delete.mockResolvedValue({});

      await service.delete('/test');

      expect(mockHttpService.delete).toHaveBeenCalledWith('/test', {
        Authorization: `Bearer ${testToken}`
      });
    });
  });
});
