import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Subject, takeUntil, map } from "rxjs";
import { AsyncPipe } from "@angular/common";

import { LazyElementsModule } from "@pichincha/angular-sdk/custom-elements/lazy-elements";
import { LoggedUser } from "@pichincha/ds-core";

import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-dashboard-layout",
  standalone: true,
  imports: [
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    RouterOutlet,
    LazyElementsModule,
    AsyncPipe,
  ],
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: ["./dashboard-layout.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class DashboardLayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private authService = inject(AuthService);

  // Convert User to LoggedUser format expected by the header component
  loggedUser$ = this.authService.getUser().pipe(
    map(
      (user) =>
        ({
          name: user?.firstName || "Usuario",
          lastName: user?.lastName || "Genérico",
        } as LoggedUser)
    )
  );
  readonly menuItems = [
    {
      a11yText: "Inicio, doble click para continuar",
      disabled: false,
      iconName: "home",
      isActive: false,
      isNew: false,
      label: "Inicio",
      showDivider: false,
      showIcon: true,
    },
    {
      iconName: "account_balance_wallet",
      isNew: false,
      isActive: false,
      label: "Mis Productos Favoritos",
      showDivider: false,
      showIcon: true,
      textBadge: "Próximamente",
    },
    {
      iconName: "supervisor_account",
      isNew: true,
      isActive: false,
      label: "Mis contactos",
      showDivider: true,
      showIcon: true,
    },
    {
      disabled: false,
      children: [
        {
          disabled: true,
          isNew: true,
          label: "Directas",
        },
        {
          label: "Interbancarias",
          textBadge: "Próximamente",
        },
      ],
      iconName: "swap_horiz",
      isNew: false,
      isActive: true,
      label: "Transferencias",
      showChildren: true,
      showDivider: false,
      showIcon: true,
    },
    {
      children: [
        {
          label: "Internacionales",
        },
      ],
      iconName: "attach_money",
      isNew: true,
      isActive: false,
      label: "Pagos",
      showChildren: false,
      showDivider: true,
      showIcon: true,
    },
    {
      disabled: true,
      iconName: "outlined_flag",
      isNew: false,
      isActive: false,
      label: "Gestionar productos",
      showDivider: false,
      showIcon: true,
    },
  ];

  ngOnInit(): void {
    // Component initialization if needed
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleLogout(): void {
    this.authService.logout();
  }

  handleClickMenuItem(itemLabel: string) {
    // Menu item clicked
  }
}
