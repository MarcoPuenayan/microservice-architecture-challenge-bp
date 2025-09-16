import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MfeAuthService {
  private authData: any = null;

  constructor() {
    this.setupPostMessageListener();
    this.requestAuthFromShell();
  }

  private setupPostMessageListener(): void {
    window.addEventListener('message', (event: MessageEvent) => {
      if (event.origin !== 'http://localhost:4200') {
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
      source: 'mfe-accounts',
    };

    window.parent.postMessage(message, 'http://localhost:4200');
  }
}
