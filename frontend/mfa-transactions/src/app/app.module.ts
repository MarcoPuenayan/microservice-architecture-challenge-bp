import { CUSTOM_ELEMENTS_SCHEMA, NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import {
  ExternalAssetsConfig,
  ExternalAssetsModule,
} from '@pichincha/angular-sdk/external-assets';
import { HttpModule } from '@pichincha/angular-sdk/http';

import { environment } from '../environments/environment';
import { RouterHelperModule } from '@pichincha/angular-sdk/router-helper';
import { routes } from './app-routing.module';
import { SharedModule } from './shared.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { AuthService } from './services/auth.service';

const assets: Array<ExternalAssetsConfig> = [
  {
    type: 'stylesheet',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
  },
];

export function initializeAuth(authService: AuthService) {
  return () => {
    return Promise.resolve();
  };
}

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    SharedModule,
    HttpModule.forRoot({ api_url: environment.apiUrl }),
    ExternalAssetsModule.forRoot(assets),
    RouterHelperModule.forRoot(''),
    RouterModule.forRoot(routes),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
