import { Injectable } from '@angular/core';

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
    window.addEventListener('message', (event) => {
      // Validar origen de seguridad
      if (event.origin !== 'http://localhost:4200') {
        return;
      }

      // Filtrar mensaje tipo AUTH_DATA
      if (event.data && event.data.type === 'AUTH_DATA') {
        this.authData = event.data.payload;
      }
    });
  }

  private requestAuthFromShell(): void {
    const message = {
      type: 'REQUEST_AUTH_DATA',
      source: 'mfe-transactions'
    };

    window.parent.postMessage(message, 'http://localhost:4200');
  }
}
