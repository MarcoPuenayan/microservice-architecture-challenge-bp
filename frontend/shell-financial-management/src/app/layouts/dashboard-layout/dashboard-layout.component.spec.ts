import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DashboardLayoutComponent } from "./dashboard-layout.component";

describe("DashboardLayoutComponent", () => {
  let component: DashboardLayoutComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<DashboardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLayoutComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });


  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should emit handleClickMenuItem when app-sidebar onClickItemSidebar is called", () => {
    const spyCloseSession = jest.spyOn(component, "handleClickMenuItem");

    const sidebar = compiled.querySelector("app-sidebar");
    sidebar?.dispatchEvent(new Event("onClickItemSidebar"));
    fixture.detectChanges();

    expect(spyCloseSession).toHaveBeenCalled();
  });
});
