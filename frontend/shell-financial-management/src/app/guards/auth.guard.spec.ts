import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { of } from "rxjs";

import { AuthGuard } from "./auth.guard";
import { AuthService } from "../services/auth.service";

describe("AuthGuard", () => {
  let guard: AuthGuard;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockRoute: ActivatedRouteSnapshot;
  let mockState: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = {
      isAuthenticated: jest.fn(),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    mockRoute = {} as ActivatedRouteSnapshot;
    mockState = { url: "/dashboard" } as RouterStateSnapshot;
  });

  it("should be created", () => {
    expect(guard).toBeTruthy();
  });

  it("should allow access when user is authenticated", (done) => {
    mockAuthService.isAuthenticated.mockReturnValue(of(true));

    guard.canActivate(mockRoute, mockState).subscribe((result) => {
      expect(result).toBe(true);
      expect(mockRouter.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it("should deny access and redirect when user is not authenticated", (done) => {
    mockAuthService.isAuthenticated.mockReturnValue(of(false));

    guard.canActivate(mockRoute, mockState).subscribe((result) => {
      expect(result).toBe(false);
      expect(mockRouter.navigate).toHaveBeenCalledWith(["/login"], {
        queryParams: { returnUrl: "/dashboard" },
      });
      done();
    });
  });
});
