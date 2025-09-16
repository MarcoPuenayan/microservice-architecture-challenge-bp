import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component } from "@angular/core";
import { of } from "rxjs";

import { HasRoleDirective } from "./has-role.directive";
import { AuthService } from "../services/auth.service";

@Component({
  template: `
    <div *appHasRole="'admin'" id="admin-content">Admin only content</div>
    <div *appHasRole="['admin', 'user']" id="user-content">
      User or admin content
    </div>
    <div *appHasRole="'superuser'" id="superuser-content">
      Superuser only content
    </div>
  `,
  standalone: true,
  imports: [HasRoleDirective],
})
class TestComponent {}

describe("HasRoleDirective", () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockAuthService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    mockAuthService = {
      authState$: of({
        isAuthenticated: true,
        user: {
          id: "1",
          username: "admin",
          email: "admin@test.com",
          firstName: "Admin",
          lastName: "User",
          roles: ["admin", "user"],
        },
        token: "mock-token",
      }),
      getUser: jest.fn().mockReturnValue(
        of({
          id: "1",
          username: "admin",
          email: "admin@test.com",
          firstName: "Admin",
          lastName: "User",
          roles: ["admin", "user"],
        })
      ),
    } as any;

    await TestBed.configureTestingModule({
      imports: [TestComponent, HasRoleDirective],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should show content for admin role", () => {
    const adminElement = fixture.nativeElement.querySelector("#admin-content");
    expect(adminElement).toBeTruthy();
    expect(adminElement.textContent).toContain("Admin only content");
  });

  it("should show content for multiple roles", () => {
    const userElement = fixture.nativeElement.querySelector("#user-content");
    expect(userElement).toBeTruthy();
    expect(userElement.textContent).toContain("User or admin content");
  });

  it("should hide content for unauthorized roles", () => {
    const superuserElement =
      fixture.nativeElement.querySelector("#superuser-content");
    expect(superuserElement).toBeFalsy();
  });

  it("should hide all content when user has no roles", () => {
    mockAuthService.getUser.mockReturnValue(
      of({
        id: "1",
        username: "noroles",
        email: "noroles@test.com",
        firstName: "No",
        lastName: "Roles",
        roles: [],
      })
    );

    fixture.detectChanges();

    const adminElement = fixture.nativeElement.querySelector("#admin-content");
    const userElement = fixture.nativeElement.querySelector("#user-content");
    const superuserElement =
      fixture.nativeElement.querySelector("#superuser-content");

    expect(adminElement).toBeFalsy();
    expect(userElement).toBeFalsy();
    expect(superuserElement).toBeFalsy();
  });
});
