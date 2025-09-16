import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { of, throwError } from "rxjs";

import { LoginComponent } from "./login.component";
import { AuthService } from "../../services/auth.service";

describe("LoginComponent", () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jest.Mocked<AuthService>;
  let mockRouter: jest.Mocked<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockAuthService = {
      login: jest.fn(),
      isAuthenticated: jest.fn(),
    } as any;

    mockRouter = {
      navigate: jest.fn(),
    } as any;

    mockActivatedRoute = {
      snapshot: {
        queryParams: {},
      },
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    mockAuthService.isAuthenticated.mockReturnValue(of(false));
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize form with empty values", () => {
    expect(component.loginForm.get("username")?.value).toBe("");
    expect(component.loginForm.get("password")?.value).toBe("");
  });

  it("should validate required fields", () => {
    const usernameControl = component.loginForm.get("username");
    const passwordControl = component.loginForm.get("password");

    expect(usernameControl?.hasError("required")).toBeTruthy();
    expect(passwordControl?.hasError("required")).toBeTruthy();
  });

  it("should call authService.login on valid form submission", () => {
    const mockLoginResponse = {
      token: "mock-token",
      user: {
        id: "1",
        username: "admin",
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "User",
        roles: ["admin"],
      },
      expiresIn: 3600000,
    };

    mockAuthService.login.mockReturnValue(of(mockLoginResponse));

    component.loginForm.patchValue({
      username: "admin",
      password: "admin123",
    });

    component.onSubmit();

    expect(mockAuthService.login).toHaveBeenCalledWith({
      username: "admin",
      password: "admin123",
    });
  });

  it("should handle login error", () => {
    const errorMessage = "Invalid credentials";
    mockAuthService.login.mockReturnValue(
      throwError(() => new Error(errorMessage))
    );

    component.loginForm.patchValue({
      username: "admin",
      password: "wrong-password",
    });

    component.onSubmit();

    expect(component.errorMessage).toBe(errorMessage);
    expect(component.isLoading).toBeFalsy();
  });

  it("should redirect to returnUrl after successful login", () => {
    const mockLoginResponse = {
      token: "mock-token",
      user: {
        id: "1",
        username: "admin",
        email: "admin@test.com",
        firstName: "Admin",
        lastName: "User",
        roles: ["admin"],
      },
      expiresIn: 3600000,
    };

    mockAuthService.login.mockReturnValue(of(mockLoginResponse));
    component.returnUrl = "/dashboard";

    component.loginForm.patchValue({
      username: "admin",
      password: "admin123",
    });

    component.onSubmit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(["/dashboard"]);
  });
});
