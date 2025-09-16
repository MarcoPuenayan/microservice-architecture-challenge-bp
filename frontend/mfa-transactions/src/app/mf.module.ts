import { CUSTOM_ELEMENTS_SCHEMA, Injector, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  ExternalAssetsModule,
  ExternalAssetsConfig,
} from '@pichincha/angular-sdk/external-assets';
import { HttpModule } from '@pichincha/angular-sdk/http';
import { environment } from '../environments/environment';
import { SharedModule } from './shared.module';
import { routes } from './app-routing.module';
// import { AppComponent } from './app.component';
// import { createCustomElement } from '@angular/elements';
// import optimus from '../../optimus.json';
// import { BrowserModule } from '@angular/platform-browser';
// import { addRouteTransform } from 'converter-module/routes';
const assets: Array<ExternalAssetsConfig> = [];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    //BrowserModule, //Active web components
    HttpModule.forRoot({ api_url: environment.apiUrl }),
    ExternalAssetsModule.forRoot(assets),
    RouterModule.forChild(routes),
    //RouterModule.forRoot(addRouteTransform(routes)), //Active web components
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MFModule {
  //Web component
  /*
  constructor(private injector: Injector) {}

  ngDoBootstrap() {
    const ce = createCustomElement(AppComponent, {
      injector: this.injector,
    });
    customElements.define(optimus.mfElement || 'mfe-element', ce);
  }
  */
}
