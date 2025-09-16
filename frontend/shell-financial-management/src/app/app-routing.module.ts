import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IRouteBase, RouterRender } from "@pichincha/angular-sdk/router-helper";
import { storage } from "@pichincha/angular-sdk/storage";
import { EStorageType } from "@pichincha/angular-sdk/auth";

import routesImport from "../assets/microapp.json";

import { Guards, ListLayout } from "./config/layouts";
import { LoginComponent } from "./components/login/login.component";
import { DashboardComponent } from "./views/dashboard/dashboard.component";
import { AuthGuard } from "./guards/auth.guard";

import { environment } from "src/environments/environment";

const routes = routesImport as unknown as IRouteBase[];
const storageConfig = storage({
  storageType: EStorageType.SESSION,
  secretKey: environment.storage.key,
});

const routerDetail = new RouterRender(routes, storageConfig);
let routesList: Routes = routerDetail.routerList(ListLayout, Guards);

// Add dashboard and authentication routes
const authRoutes: Routes = [
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "dashboard",
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "/dashboard",
    pathMatch: "full",
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

// Add AuthGuard to protect existing MFE routes
routesList = routesList.map((route) => ({
  ...route,
  canActivate: route.path !== "login" ? [AuthGuard] : undefined,
}));

// Combine routes - auth routes first to ensure proper handling
routesList = [...authRoutes, ...routesList];

@NgModule({
  imports: [RouterModule.forRoot(routesList)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
