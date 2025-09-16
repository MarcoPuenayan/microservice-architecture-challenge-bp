import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authData: any = null;

  constructor() {
    this.setupPostMessageListener();
    this.requestAuthFromShell();
  }

  private setupPostMessageListener(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      const allowedOrigins = [
        'http://localhost:4200',
        environment.production ? window.location.origin : 'http://localhost:4200'
      ];
      
      if (!allowedOrigins.includes(event.origin)) {
        return;
      }

      if (event.data && event.data.type === 'AUTH_DATA') {
        this.authData = event.data.payload;
        
        if (this.authData && this.authData.token) {
          sessionStorage.setItem(environment.authProvider.accessTokenName, this.authData.token);
        }
      }
    });
  }

  private requestAuthFromShell(): void {
    const message = {
      type: 'REQUEST_AUTH_DATA',
      source: 'mfa-transactions',
    };

    const shellOrigin = environment.production ? window.location.origin : 'http://localhost:4200';
    window.parent.postMessage(message, shellOrigin);
  }
  
  getToken(): string | null {
    if (this.authData && this.authData.token) {
      return this.authData.token;
    }

    const token = sessionStorage.getItem(environment.authProvider.accessTokenName);
    if (token) {
      return token;
    }

    try {
      let authDataStr = sessionStorage.getItem('mfe_auth_data');
      if (authDataStr) {
        const authData = JSON.parse(authDataStr);
        if (authData && authData.token) {
          return authData.token;
        }
      }
      
      const directToken = sessionStorage.getItem('auth_token');
      if (directToken) {
        return directToken;
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthData(): any {
    return this.authData;
  }

  requestAuthUpdate(): void {
    this.requestAuthFromShell();
  }
}
