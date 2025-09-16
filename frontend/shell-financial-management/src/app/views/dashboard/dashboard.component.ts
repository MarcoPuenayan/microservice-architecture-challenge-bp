import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { AuthService } from "../../services/auth.service";
import { MfeService, MFEConfig } from "../../services/mfe.service";
import { User } from "../../interfaces/auth.interface";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  user: User | null = null;
  currentMFE: MFEConfig | null = null;
  currentMFEUrl: SafeResourceUrl | null = null;
  menuItems: MFEConfig[] = [];
  sidebarCollapsed: boolean = true;

  constructor(
    private authService: AuthService,
    private mfeService: MfeService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.loadMFEConfigs();
    this.setupMFESubscription();
    this.setupPostMessageListener();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData(): void {
    this.authService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.user = user;
        this.cdr.detectChanges();
      });
  }

  private loadMFEConfigs(): void {
    this.menuItems = this.mfeService.getMFEConfigs();
  }

  private setupMFESubscription(): void {
    this.mfeService.currentMFE
      .pipe(takeUntil(this.destroy$))
      .subscribe((mfe) => {
        this.currentMFE = mfe;
        if (mfe) {
          this.currentMFEUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            mfe.url
          );
        } else {
          this.currentMFEUrl = null;
        }
        this.cdr.detectChanges();
      });
  }

  private setupPostMessageListener(): void {
    window.addEventListener("message", (event) => {
      const { type, source } = event.data;

      if (type === "REQUEST_AUTH_DATA") {
        const authState = this.authService.getCurrentAuthState();

        if (authState.isAuthenticated) {
          const authData = {
            token: authState.token,
            user: authState.user,
            isAuthenticated: true,
            timestamp: Date.now(),
          };

          event.source?.postMessage(
            {
              type: "AUTH_DATA",
              payload: authData,
            },
            { targetOrigin: event.origin }
          );
        }
      }
    });
  }

  private sendAuthDataToMFE(iframe: HTMLIFrameElement): void {
    const authState = this.authService.getCurrentAuthState();

    if (authState.isAuthenticated && authState.token) {
      const authData = {
        token: authState.token,
        user: authState.user,
        isAuthenticated: true,
        timestamp: Date.now(),
      };

      setTimeout(() => {
        iframe.contentWindow?.postMessage(
          {
            type: "AUTH_DATA",
            payload: authData,
          },
          "*"
        );

      }, 1000);
    }
  }

  onIframeLoad(event: Event): void {
    const iframe = event.target as HTMLIFrameElement;
    if (this.currentMFE && iframe) {
      // Register the iframe with the MFE service for communication
      this.mfeService.registerIframe(this.currentMFE.id, iframe);

      this.sendAuthDataToMFE(iframe);
    }
  }

  onMenuItemClick(item: MFEConfig): void {
    this.mfeService.loadMFE(item.id);
  }

  onCloseMFE(): void {
    this.mfeService.closeMFE();
  }

  onLogout(): void {
    this.authService.logout();
  }

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    this.cdr.detectChanges();
  }

  getUserDisplayName(): string {
    if (!this.user) return "Usuario";
    return `${this.user.firstName} ${this.user.lastName}`.trim();
  }

  getUserInitials(): string {
    if (!this.user) return "U";
    const firstInitial = this.user.firstName?.charAt(0) || "";
    const lastInitial = this.user.lastName?.charAt(0) || "";
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  isMenuItemActive(item: MFEConfig): boolean {
    return this.currentMFE?.id === item.id;
  }
}
