import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { of } from "rxjs";

import { AuthService } from "./auth.service";
import { LoginRequest, KeycloakTokenResponse } from "../interfaces/auth.interface";
import { environment } from "../../environments/environment";

describe("AuthService", () => {
  let service: AuthService;
  let mockRouter: jest.Mocked<Router>;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, { provide: Router, useValue: mockRouter }],
    });

    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);

    // Clear sessionStorage before each test
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
    httpTestingController.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should start with unauthenticated state", (done) => {
    service.authState$.subscribe((state) => {
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      done();
    });
  });

  it("should login with valid credentials via Keycloak", (done) => {
    const loginRequest: LoginRequest = {
      username: "testuser",
      password: "testpass",
    };

    const mockKeycloakResponse: KeycloakTokenResponse = {
      access_token: "mock_access_token",
      expires_in: 300,
      refresh_token: "mock_refresh_token",
      refresh_expires_in: 1800,
      token_type: "Bearer"
    };

    service.login(loginRequest).subscribe({
      next: (response) => {
        expect(response.user.username).toBe("testuser");
        expect(response.token).toBe("mock_access_token");
        expect(response.refreshToken).toBe("mock_refresh_token");
        expect(sessionStorage.getItem("auth_token")).toBe("mock_access_token");
        done();
      },
      error: (error) => {
        fail("Login should succeed with valid credentials");
      },
    });

    const req = httpTestingController.expectOne(environment.keycloak.tokenUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/x-www-form-urlencoded');
    
    req.flush(mockKeycloakResponse);
  });

  it("should fail login with invalid credentials", (done) => {
    const loginRequest: LoginRequest = {
      username: "invalid",
      password: "invalid",
    };

    service.login(loginRequest).subscribe({
      next: (response) => {
        fail("Login should fail with invalid credentials");
      },
      error: (error) => {
        expect(error.message).toBe("Credenciales inválidas");
        done();
      },
    });

    const req = httpTestingController.expectOne(environment.keycloak.tokenUrl);
    req.error(new ErrorEvent('Unauthorized'), { status: 401, statusText: 'Unauthorized' });
  });

  it("should update auth state after successful login", (done) => {
    const loginRequest: LoginRequest = {
      username: "testuser",
      password: "testpass",
    };

    const mockKeycloakResponse: KeycloakTokenResponse = {
      access_token: "mock_access_token",
      expires_in: 300,
      refresh_token: "mock_refresh_token",
      refresh_expires_in: 1800,
      token_type: "Bearer"
    };

    service.login(loginRequest).subscribe(() => {
      service.authState$.subscribe((state) => {
        expect(state.isAuthenticated).toBe(true);
        expect(state.user?.username).toBe("testuser");
        expect(state.token).toBe("mock_access_token");
        done();
      });
    });

    const req = httpTestingController.expectOne(environment.keycloak.tokenUrl);
    req.flush(mockKeycloakResponse);
  });

  it("should logout and clear auth state", () => {
    // First login
    const loginRequest: LoginRequest = {
      username: "admin",
      password: "admin123",
    };

    service.login(loginRequest).subscribe(() => {
      // Then logout
      service.logout();

      service.authState$.subscribe((state) => {
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });

      expect(sessionStorage.getItem("auth_token")).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"]);
    });
  });

  it("should return correct authentication status", (done) => {
    service.isAuthenticated().subscribe((isAuth) => {
      expect(isAuth).toBe(false);
      done();
    });
  });

  it("should return current user", (done) => {
    service.getUser().subscribe((user) => {
      expect(user).toBeNull();
      done();
    });
  });

  it("should check user roles correctly", (done) => {
    const loginRequest: LoginRequest = {
      username: "testuser",
      password: "testpass",
    };

    const mockKeycloakResponse: KeycloakTokenResponse = {
      access_token: "mock_access_token",
      expires_in: 300,
      refresh_token: "mock_refresh_token",
      refresh_expires_in: 1800,
      token_type: "Bearer"
    };

    service.login(loginRequest).subscribe(() => {
      service.hasRole("user").subscribe((hasRole) => {
        expect(hasRole).toBe(true);
      });

      service.hasRole("admin").subscribe((hasRole) => {
        expect(hasRole).toBe(false);
        done();
      });
    });

    const req = httpTestingController.expectOne(environment.keycloak.tokenUrl);
    req.flush(mockKeycloakResponse);
  });

  it("should validate token correctly", () => {
    // This test would require accessing the private method, so we test through login
    const loginRequest: LoginRequest = {
      username: "admin",
      password: "admin123",
    };

    service.login(loginRequest).subscribe(() => {
      expect(service.getToken()).toBeDefined();
    });
  });

  it("should refresh token successfully", (done) => {
    // Set up initial auth state with refresh token
    sessionStorage.setItem("refresh_token", "mock_refresh_token");
    sessionStorage.setItem("auth_token", "old_token");
    sessionStorage.setItem("user_data", JSON.stringify({
      id: "testuser",
      username: "testuser",
      email: "testuser@pichincha.com",
      firstName: "testuser",
      lastName: "User",
      roles: ["user"]
    }));

    const mockRefreshResponse: KeycloakTokenResponse = {
      access_token: "new_access_token",
      expires_in: 300,
      refresh_token: "new_refresh_token",
      refresh_expires_in: 1800,
      token_type: "Bearer"
    };

    service.refreshToken().subscribe({
      next: (response) => {
        expect(response.token).toBe("new_access_token");
        expect(response.refreshToken).toBe("new_refresh_token");
        expect(sessionStorage.getItem("auth_token")).toBe("new_access_token");
        done();
      },
      error: (error) => {
        fail("Token refresh should succeed");
      },
    });

    const req = httpTestingController.expectOne(environment.keycloak.tokenUrl);
    expect(req.request.method).toBe('POST');
    
    req.flush(mockRefreshResponse);
  });
});
