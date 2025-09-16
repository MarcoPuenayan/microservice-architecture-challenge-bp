import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { MfeAuthService } from './services/mfe-auth.service';

const assets: Array<ExternalAssetsConfig> = [
  {
    type: 'stylesheet',
    url: 'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css', // ejemplo /assets/bootstrap.css
  },
];

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
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
