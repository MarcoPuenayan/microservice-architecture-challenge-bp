import { LoggedGuard } from "../guards/logged.guard";
import { DashboardLayoutComponent } from "../layouts/dashboard-layout/dashboard-layout.component";
import { ListLayout, Guards } from "./layouts";

describe("layouts", () => {
  describe("ListLayout", () => {
    it("should contain DashboardLayoutComponent and FullpageWithHeaderComponent", () => {
      expect(ListLayout.dashboard).toEqual(DashboardLayoutComponent);
    });
  });

  describe("Guards", () => {
    it("should contain LoggedGuard", () => {
      expect(Guards.looger).toEqual(LoggedGuard);
    });
  });
});
