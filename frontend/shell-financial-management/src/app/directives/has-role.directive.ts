import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { AuthService } from "../services/auth.service";

/**
 * Structural directive to show/hide elements based on user roles
 *
 * Usage:
 * <div *appHasRole="'admin'">Only admin can see this</div>
 * <div *appHasRole="['admin', 'user']">Admin or user can see this</div>
 */
@Directive({
  selector: "[appHasRole]",
  standalone: true,
})
export class HasRoleDirective implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private currentRoles: string | string[] = [];

  @Input() set appHasRole(roles: string | string[]) {
    this.currentRoles = roles;
    this.updateView();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Listen to authentication state changes
    this.authService.authState$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateView(): void {
    this.authService
      .getUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (this.checkUserHasRole(user?.roles || [])) {
          this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
          this.viewContainer.clear();
        }
      });
  }

  private checkUserHasRole(userRoles: string[]): boolean {
    if (!userRoles.length) return false;

    const requiredRoles = Array.isArray(this.currentRoles)
      ? this.currentRoles
      : [this.currentRoles];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
