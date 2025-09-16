import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { User } from "../interfaces/auth.interface";

/**
 * Example service showing how to use AuthService in other services
 */
@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private authService: AuthService) {}

  /**
   * Get user profile data
   */
  getUserProfile(): Observable<User | null> {
    return this.authService.getUser();
  }

  /**
   * Check if current user has admin role
   */
  isAdmin(): Observable<boolean> {
    return this.authService.hasRole("admin");
  }

  /**
   * Get user permissions based on roles
   */
  getUserPermissions(): Observable<string[]> {
    return this.authService.getUser().pipe(
      map((user) => {
        if (!user) return [];

        const permissions: string[] = [];

        if (user.roles.includes("admin")) {
          permissions.push("manage_users", "view_reports", "manage_settings");
        }

        if (user.roles.includes("user")) {
          permissions.push("view_dashboard", "make_transfers");
        }

        return permissions;
      })
    );
  }

  /**
   * Update user profile (would make HTTP call in real implementation)
   */
  updateProfile(updates: Partial<User>): Observable<User> {
    // This would typically make an HTTP call
    // The AuthService will automatically inject the JWT token via AuthInterceptor
    return this.authService.getUser().pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        // Mock update - in real app, this would be an HTTP call
        const updatedUser = { ...currentUser, ...updates };
        return of(updatedUser);
      })
    );
  }

  /**
   * Get user display name
   */
  getUserDisplayName(): Observable<string> {
    return this.authService.getUser().pipe(
      map((user) => {
        if (!user) return "Usuario";
        return `${user.firstName} ${user.lastName}`.trim();
      })
    );
  }
}
