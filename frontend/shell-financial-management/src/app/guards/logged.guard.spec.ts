import { TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";

import { LoggedGuard } from "./logged.guard";

describe("LoggedGuard", () => {
  let guard: LoggedGuard;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [LoggedGuard],
    });
    guard = TestBed.inject(LoggedGuard);
    router = TestBed.inject(Router);
  });

  it("should create", () => {
    expect(guard).toBeTruthy();
  });

  it("should navigate to mainPath on canActivate", () => {
    jest.spyOn(router, "navigate").mockResolvedValue(true);
    const result = guard.canActivate();
    expect(router.navigate).toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
