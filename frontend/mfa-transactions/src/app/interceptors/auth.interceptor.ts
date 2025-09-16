import { Injectable, inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authData = this.getAuthDataFromStorage();
    
    if (authData && authData.token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${authData.token}`
        }
      });
      return next.handle(authReq);
    } else {
      this.authService.requestAuthUpdate();
    }
    
    return next.handle(req);
  }

  private getAuthDataFromStorage(): any {
    const token = this.authService.getToken();
    return token ? { token } : null;
  }
}
