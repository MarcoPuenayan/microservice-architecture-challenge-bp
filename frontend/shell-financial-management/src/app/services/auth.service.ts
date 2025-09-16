import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, of, throwError, timer } from "rxjs";
import { tap, catchError, map, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import {
  AuthState,
  LoginRequest,
  LoginResponse,
  User,
  KeycloakTokenResponse,
} from "../interfaces/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = "auth_token";
  private readonly USER_DATA_KEY = "user_data";
  private readonly REFRESH_TOKEN_KEY = "refresh_token";
  private readonly TOKEN_EXPIRES_AT_KEY = "token_expires_at";

  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  public authState$ = this.authStateSubject.asObservable();
  private tokenRefreshTimer: any;

  constructor(private router: Router, private http: HttpClient) {
    this.initializeAuthState();
  }

  /**
   * Initialize authentication state from storage
   */
  private initializeAuthState(): void {
    try {
      const token = this.getFromStorage(this.AUTH_TOKEN_KEY);
      const userData = this.getFromStorage(this.USER_DATA_KEY);
      const expiresAt = this.getFromStorage(this.TOKEN_EXPIRES_AT_KEY);

      if (token && userData && this.isTokenValid(expiresAt)) {
        this.updateAuthState({
          isAuthenticated: true,
          user: JSON.parse(userData),
          token: token,
        });
        this.scheduleTokenRefresh();
      } else {
        this.clearAuthData();
      }
    } catch (error) {
      this.clearAuthData();
    }
  }

  /**
   * Get data from sessionStorage
   */
  private getFromStorage(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  /**
   * Set data to sessionStorage
   */
  private setToStorage(key: string, value: string): void {
    try {
      sessionStorage.setItem(key, value);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Remove data from sessionStorage
   */
  private removeFromStorage(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      // Silent error - storage cleanup
    }
  }

  /**
   * Check if token is valid (not expired)
   */
  private isTokenValid(expiresAt: string | null): boolean {
    if (!expiresAt) return false;
    try {
      const expirationTime = parseInt(expiresAt, 10);
      return Date.now() < expirationTime;
    } catch (error) {
      return false;
    }
  }

  /**
   * Update authentication state
   */
  private updateAuthState(state: AuthState): void {
    this.authStateSubject.next(state);
  }

  /**
   * Schedule automatic token refresh
   */
  private scheduleTokenRefresh(): void {
    const expiresAt = this.getFromStorage(this.TOKEN_EXPIRES_AT_KEY);
    if (!expiresAt) return;

    const expirationTime = parseInt(expiresAt, 10);
    const currentTime = Date.now();
    const timeUntilRefresh = expirationTime - currentTime - 60000; // Refresh 1 minute before expiry

    if (timeUntilRefresh > 0) {
      this.tokenRefreshTimer = timer(timeUntilRefresh).subscribe(() => {
        this.refreshToken().subscribe();
      });
    }
  }

  /**
   * Login with Keycloak
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'password');
    body.set('client_id', environment.keycloak.clientId);
    body.set('client_secret', environment.keycloak.clientSecret);
    body.set('username', credentials.username);
    body.set('password', credentials.password);

    return this.http.post<KeycloakTokenResponse>(
      environment.keycloak.tokenUrl,
      body.toString(),
      { headers }
    ).pipe(
      map((keycloakResponse) => {
        // Parse user info from token (simplified approach)
        const user: User = {
          id: credentials.username, // Using username as ID for now
          username: credentials.username,
          email: `${credentials.username}@pichincha.com`,
          firstName: credentials.username,
          lastName: 'User',
          roles: ['user']
        };

        const loginResponse: LoginResponse = {
          token: keycloakResponse.access_token,
          user: user,
          refreshToken: keycloakResponse.refresh_token,
          expiresIn: keycloakResponse.expires_in * 1000 // Convert to milliseconds
        };

        return loginResponse;
      }),
      tap((response) => {
        this.setAuthData(response);
        this.updateAuthState({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
        });
        this.scheduleTokenRefresh();
      }),
      catchError((error) => {
        return throwError(() => new Error("Credenciales inválidas"));
      })
    );
  }

  /**
   * Store authentication data securely
   */
  private setAuthData(response: LoginResponse): void {
    try {
      const expiresAt = Date.now() + response.expiresIn;
      
      this.setToStorage(this.AUTH_TOKEN_KEY, response.token);
      this.setToStorage(this.USER_DATA_KEY, JSON.stringify(response.user));
      this.setToStorage(this.TOKEN_EXPIRES_AT_KEY, expiresAt.toString());

      if (response.refreshToken) {
        this.setToStorage(this.REFRESH_TOKEN_KEY, response.refreshToken);
      }
    } catch (error) {
      console.error("Error storing auth data:", error);
      throw error;
    }
  }

  /**
   * Logout user and clear all auth data
   */
  logout(): void {
    if (this.tokenRefreshTimer) {
      this.tokenRefreshTimer.unsubscribe();
    }
    this.clearAuthData();
    this.updateAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
    });
    this.router.navigate(["/login"]);
  }

  /**
   * Clear all authentication data from storage
   */
  private clearAuthData(): void {
    try {
      this.removeFromStorage(this.AUTH_TOKEN_KEY);
      this.removeFromStorage(this.USER_DATA_KEY);
      this.removeFromStorage(this.REFRESH_TOKEN_KEY);
      this.removeFromStorage(this.TOKEN_EXPIRES_AT_KEY);
    } catch (error) {
      // Silent error - storage cleanup
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): Observable<boolean> {
    return this.authState$.pipe(map((state) => state.isAuthenticated));
  }

  /**
   * Get current user data
   */
  getUser(): Observable<User | null> {
    return this.authState$.pipe(map((state) => state.user));
  }

  /**
   * Get current auth token
   */
  getToken(): string | null {
    return this.authStateSubject.value.token;
  }

  /**
   * Get current auth state
   */
  getCurrentAuthState(): AuthState {
    return this.authStateSubject.value;
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): Observable<boolean> {
    return this.getUser().pipe(
      map((user) => user?.roles?.includes(role) || false)
    );
  }

  /**
   * Refresh token using refresh_token
   */
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getFromStorage(this.REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      return throwError(() => new Error("No refresh token available"));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    const body = new URLSearchParams();
    body.set('grant_type', 'refresh_token');
    body.set('client_id', environment.keycloak.clientId);
    body.set('client_secret', environment.keycloak.clientSecret);
    body.set('refresh_token', refreshToken);

    return this.http.post<KeycloakTokenResponse>(
      environment.keycloak.tokenUrl,
      body.toString(),
      { headers }
    ).pipe(
      map((keycloakResponse) => {
        const currentUser = this.authStateSubject.value.user;
        
        const loginResponse: LoginResponse = {
          token: keycloakResponse.access_token,
          user: currentUser!, // User should exist during refresh
          refreshToken: keycloakResponse.refresh_token,
          expiresIn: keycloakResponse.expires_in * 1000
        };

        return loginResponse;
      }),
      tap((response) => {
        this.setAuthData(response);
        this.updateAuthState({
          isAuthenticated: true,
          user: response.user,
          token: response.token,
        });
        this.scheduleTokenRefresh();
      }),
      catchError((error) => {
        this.logout();
        return throwError(() => new Error("Token refresh failed"));
      })
    );
  }
}
