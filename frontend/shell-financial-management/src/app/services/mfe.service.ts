import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface MFEConfig {
  id: string;
  name: string;
  url: string;
  icon: string;
  description: string;
}

export interface MFEMessage {
  type: 'AUTH_DATA' | 'NAVIGATION' | 'ERROR' | 'READY' | 'REQUEST_AUTH' | 'SESSION_UPDATE';
  payload?: any;
  source?: string;
  target?: string;
  timestamp?: number;
}

export interface AuthData {
  token: string;
  user: any;
  isAuthenticated: boolean;
  sessionId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MfeService {
  private currentMFE$ = new BehaviorSubject<MFEConfig | null>(null);
  private messageSubject = new BehaviorSubject<MFEMessage | null>(null);
  private activeIframes = new Map<string, HTMLIFrameElement>();

  public currentMFE = this.currentMFE$.asObservable();
  public messages = this.messageSubject.asObservable();

  private mfeConfigs: MFEConfig[] = [
    {
      id: 'clientes',
      name: 'Gestión de Clientes',
      url: environment.mfeUrls.customers,
      icon: 'people',
      description: 'Gestione la información de sus clientes'
    },
    {
      id: 'cuentas',
      name: 'Administración de Cuentas',
      url: environment.mfeUrls.accounts,
      icon: 'account_balance',
      description: 'Administre sus cuentas bancarias'
    },
    {
      id: 'movimientos',
      name: 'Movimientos y Transacciones',
      url: environment.mfeUrls.transactions,
      icon: 'swap_horiz',
      description: 'Consulte movimientos y transacciones'
    },
    {
      id: 'reportes',
      name: 'Reportes y Análisis',
      url: environment.mfeUrls.reports,
      icon: 'assessment',
      description: 'Genere reportes y análisis detallados'
    }
  ];

  constructor(private authService: AuthService) {
    this.initializeMessageListener();
    this.initializeStorageListener();
    this.ensureAuthDataInStorage();
  }

  /**
   * Get all available MFE configurations
   */
  getMFEConfigs(): MFEConfig[] {
    return this.mfeConfigs;
  }

  /**
   * Get a specific MFE configuration by ID
   */
  getMFEConfig(id: string): MFEConfig | undefined {
    return this.mfeConfigs.find(mfe => mfe.id === id);
  }

  /**
   * Register an iframe when it loads
   */
  registerIframe(mfeId: string, iframe: HTMLIFrameElement): void {
    this.activeIframes.set(mfeId, iframe);
    
    // Send auth data once iframe is registered
    setTimeout(() => {
      this.sendAuthDataToMFE(mfeId);
    }, 1000); // Give iframe time to load
  }

  /**
   * Unregister an iframe when it's removed
   */
  unregisterIframe(mfeId: string): void {
    this.activeIframes.delete(mfeId);
  }

  /**
   * Load a specific MFE
   */
  loadMFE(mfeId: string): Observable<MFEConfig | null> {
    const mfeConfig = this.getMFEConfig(mfeId);
    
    if (mfeConfig) {
      this.currentMFE$.next(mfeConfig);
      // Auth data will be sent when iframe registers itself
    } else {
      console.error(`MFE with id '${mfeId}' not found`);
      this.currentMFE$.next(null);
    }
    
    return this.currentMFE;
  }

  /**
   * Close the current MFE
   */
  closeMFE(): void {
    const currentMFE = this.currentMFE$.value;
    if (currentMFE) {
      this.unregisterIframe(currentMFE.id);
    }
    this.currentMFE$.next(null);
  }

  /**
   * Send authentication data to a specific MFE via PostMessage
   */
  sendAuthDataToMFE(mfeId: string): void {
    const iframe = this.activeIframes.get(mfeId);
    const authState = this.authService.getCurrentAuthState();
    
    if (iframe && iframe.contentWindow && authState.isAuthenticated) {
      const authData: AuthData = {
        token: authState.token || '',
        user: authState.user,
        isAuthenticated: true,
        sessionId: `session_${Date.now()}`
      };

      // Store in sessionStorage for MFE access
      this.updateSessionStorage(authData);

      // Send message to MFE iframe (if supported)
      this.sendMessageToMFE({
        type: 'AUTH_DATA',
        payload: authData,
        source: 'shell',
        target: mfeId,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Update session storage with authentication data
   */
  private updateSessionStorage(authData: any): void {
    try {
      sessionStorage.setItem('auth_token', authData.token);
      sessionStorage.setItem('user_data', JSON.stringify(authData.user));
      sessionStorage.setItem('authentication', JSON.stringify(authData));
      
      // Also store in a format that legacy MFEs might expect
      sessionStorage.setItem('bp_auth_token', authData.token);
      sessionStorage.setItem('bp_user_info', JSON.stringify(authData.user));
      
    } catch (error) {
      // Error updating sessionStorage
    }
  }

  /**
   * Ensure authentication data is always available in storage
   */
  private ensureAuthDataInStorage(): void {
    this.authService.authState$.subscribe(authState => {
      if (authState.isAuthenticated && authState.token && authState.user) {
        const authData = {
          token: authState.token,
          user: authState.user,
          isAuthenticated: true,
          timestamp: Date.now()
        };
        this.updateSessionStorage(authData);
      } else {
        // Clear auth data when not authenticated
        this.clearSessionStorage();
      }
    });
  }

  /**
   * Clear authentication data from storage
   */
  private clearSessionStorage(): void {
    try {
      sessionStorage.removeItem('auth_token');
      sessionStorage.removeItem('user_data');
      sessionStorage.removeItem('authentication');
      sessionStorage.removeItem('bp_auth_token');
      sessionStorage.removeItem('bp_user_info');
    } catch (error) {
      console.error('Error clearing sessionStorage:', error);
    }
  }

  /**
   * Send message to MFE iframe
   */
  private sendMessageToMFE(message: MFEMessage): void {
    // This would send messages to the iframe if the MFE supports postMessage communication
    try {
      const iframe = document.querySelector('iframe.mfe-iframe') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        iframe.contentWindow.postMessage(message, '*');
      }
    } catch (error) {
      // MFE iframe not ready for messaging
    }
  }

  /**
   * Initialize message listener for MFE communication
   */
  private initializeMessageListener(): void {
    window.addEventListener('message', (event) => {
      // Validate message origin for security
      if (this.isValidMFEOrigin(event.origin)) {
        const message = event.data as MFEMessage;
        
        this.messageSubject.next(message);
        
        // Handle specific message types
        this.handleMFEMessage(message);
      }
    });
  }

  /**
   * Initialize storage listener for cross-tab session sync
   */
  private initializeStorageListener(): void {
    window.addEventListener('storage', (event) => {
      if (event.key === 'authentication' && event.newValue) {
        try {
          const authData = JSON.parse(event.newValue);
          this.broadcastSessionUpdate(authData);
        } catch (error) {
          console.error('Error parsing storage event data:', error);
        }
      }
    });
  }

  /**
   * Broadcast session updates to all active MFEs
   */
  private broadcastSessionUpdate(authData: AuthData): void {
    this.activeIframes.forEach((iframe, mfeId) => {
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage({
          type: 'SESSION_UPDATE',
          payload: authData,
          source: 'shell',
          target: mfeId,
          timestamp: Date.now()
        }, '*');
      }
    });
  }

  /**
   * Validate if the message origin is from a known MFE
   */
  private isValidMFEOrigin(origin: string): boolean {
    const allowedOrigins = [
      'http://localhost:4201',
      'http://localhost:63807'
    ];
    
    return allowedOrigins.some(allowedOrigin => origin.startsWith(allowedOrigin));
  }

  /**
   * Handle specific message types from MFEs
   */
  private handleMFEMessage(message: MFEMessage): void {
    switch (message.type) {
      case 'READY':
        // Resend auth data when MFE is ready
        const currentMFE = this.currentMFE$.value;
        if (currentMFE) {
          this.sendAuthDataToMFE(currentMFE.id);
        }
        break;
        
      case 'NAVIGATION':
        // Handle navigation requests from MFE
        break;
        
      case 'ERROR':
        // Handle errors from MFE
        break;
        
      default:
        // Unhandled MFE message type
        break;
    }
  }

  /**
   * Check if MFE URLs are reachable (basic health check)
   */
  async checkMFEHealth(mfeId: string): Promise<boolean> {
    const mfeConfig = this.getMFEConfig(mfeId);
    if (!mfeConfig) return false;

    try {
      const response = await fetch(mfeConfig.url, { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}
