import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

import { EventBusModule } from "@pichincha/angular-sdk/eventbus";
import { HttpModule } from "@pichincha/angular-sdk/http";
import { StorageModule } from "@pichincha/angular-sdk/storage";
import { EStorageType } from "@pichincha/angular-sdk/auth";

import { AppComponent } from "./app.component";
import { DashboardLayoutComponent } from "./layouts/dashboard-layout/dashboard-layout.component";
import { FullpageWithHeaderComponent } from "./layouts/fullpage-with-header/fullpage-with-header.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";

import { AppRoutingModule } from "./app-routing.module";

import { AuthInterceptor } from "./interceptors/auth.interceptor";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { MfeService } from "./services/mfe.service";

import { environment } from "../environments/environment";

@NgModule({
  declarations: [AppComponent, DashboardComponent],
  imports: [
    BrowserModule,
    CommonModule,
    RouterOutlet,
    HttpClientModule,
    AppRoutingModule,

    /* --- pichincha-angular-sdk ---*/
    EventBusModule,
    StorageModule.forRoot({
      storageType: EStorageType.SESSION,
      secretKey: environment.storage.key,
    }),
    HttpModule.forRoot({ api_url: environment.apiUrl }),

    /* ---- components ---- */
    DashboardLayoutComponent,
    FullpageWithHeaderComponent,
  ],
  providers: [
    MfeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
  schemas: [],
})
export class AppModule {}
