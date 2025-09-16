import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject, takeUntil } from "rxjs";
import { CommonModule } from "@angular/common";

import { AuthService } from "../../services/auth.service";
import { LoginRequest } from "../../interfaces/auth.interface";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = "";
  returnUrl = "/";
  showPassword = false;
  private usernameStorageKey = "rememberedUsername";

  @ViewChild("usernameInput") usernameInput!: ElementRef<HTMLInputElement>;
  @ViewChild("generalError") generalError!: ElementRef<HTMLDivElement>;

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.getReturnUrl();
    this.checkIfAlreadyAuthenticated();
    this.restoreRememberedUsername();
  }

  ngAfterViewInit(): void {
    // Focus username on first paint for quicker interaction (non-blocking)
    setTimeout(() => {
      this.usernameInput?.nativeElement?.focus();
    }, 0);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(3)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  private getReturnUrl(): void {
    // Always redirect to dashboard after login
    this.returnUrl = "/dashboard";
  }

  private checkIfAlreadyAuthenticated(): void {
    this.authService
      .isAuthenticated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isAuthenticated) => {
        if (isAuthenticated) {
          this.router.navigate(["/dashboard"]);
        }
      });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = "";
      // Trim values to avoid accidental leading/trailing spaces
      const rawUsername = (this.loginForm.value.username || "").trim();
      const rawPassword = (this.loginForm.value.password || "").trim();
      const loginRequest: LoginRequest = {
        username: rawUsername,
        password: rawPassword,
      };

      // Update cleaned values back to form controls (without emitting events)
      if (rawUsername !== this.loginForm.value.username) {
        this.username?.setValue(rawUsername, { emitEvent: false });
      }
      if (rawPassword !== this.loginForm.value.password) {
        this.password?.setValue(rawPassword, { emitEvent: false });
      }

      this.authService
        .login(loginRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.persistRememberMe(rawUsername);
            this.router.navigate(["/dashboard"]);
          },
          error: (error) => {
            this.errorMessage =
              error.message ||
              "Error al iniciar sesión. Por favor, intente nuevamente.";
            this.isLoading = false;
            // Focus error container for screen readers & keyboard users
            setTimeout(() => {
              this.generalError?.nativeElement?.focus();
            }, 0);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
    } else {
      this.markFormGroupTouched();
      this.focusFirstInvalid();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  private focusFirstInvalid(): void {
    const firstInvalid = Object.keys(this.loginForm.controls).find(
      (k) => this.loginForm.get(k)?.invalid
    );
    if (firstInvalid) {
      const el = document.querySelector<HTMLElement>(
        `[formcontrolname="${firstInvalid}"]`
      );
      if (el) {
        setTimeout(() => el.focus(), 0);
      }
    }
  }

  private restoreRememberedUsername(): void {
    try {
      const remembered = localStorage.getItem(this.usernameStorageKey);
      if (remembered) {
        this.username?.setValue(remembered);
        this.loginForm.get("rememberMe")?.setValue(true);
      }
    } catch (_) {
      // Ignore storage issues (private mode, etc.)
    }
  }

  private persistRememberMe(username: string): void {
    const remember = this.loginForm.get("rememberMe")?.value;
    try {
      if (remember) {
        localStorage.setItem(this.usernameStorageKey, username);
      } else {
        localStorage.removeItem(this.usernameStorageKey);
      }
    } catch (_) {
      // Non-fatal if storage not available
    }
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
    // Re-focus password field after toggling for better UX
    const pwdEl = document.getElementById("password");
    if (pwdEl) setTimeout(() => pwdEl.focus(), 0);
  }

  get username() {
    return this.loginForm.get("username");
  }

  get password() {
    return this.loginForm.get("password");
  }

  get rememberMe() {
    return this.loginForm.get("rememberMe");
  }

  hasError(controlName: string, errorType: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!(
      control?.hasError(errorType) && (control?.touched || control?.dirty)
    );
  }
}
