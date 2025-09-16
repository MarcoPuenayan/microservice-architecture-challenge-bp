import { Injectable } from "@angular/core";
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from "@angular/router";
import { Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          // Only preserve returnUrl if it's not the default dashboard route
          const returnUrl = state.url !== "/dashboard" ? state.url : undefined;
          this.router.navigate(["/login"], {
            queryParams: returnUrl ? { returnUrl } : undefined,
          });
        }
      }),
      map((isAuthenticated) => isAuthenticated)
    );
  }
}
