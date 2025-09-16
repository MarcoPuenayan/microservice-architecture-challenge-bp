import { LoggedGuard } from "../guards/logged.guard";
import { AuthGuard } from "../guards/auth.guard";
import { DashboardLayoutComponent } from "../layouts/dashboard-layout/dashboard-layout.component";
import { FullpageWithHeaderComponent } from "../layouts/fullpage-with-header/fullpage-with-header.component";

export const ListLayout: any = {
  dashboard: DashboardLayoutComponent,
  fullPageHeader: FullpageWithHeaderComponent,
  empty: "",
};

export const Guards: any = {
  looger: LoggedGuard,
  auth: AuthGuard,
};
