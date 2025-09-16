import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeaderComponent } from "./header.component";

describe("HeaderComponent", () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let compiled: HTMLElement;
  let component: HeaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.componentRef.setInput("loggedUser", {
      name: "user",
      lastName: "test",
    });

    fixture.detectChanges();
  });

  it("should create the HeaderComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should emit handleCloseSession when pichincha-menu-bar closeSession is called", () => {
    const spyCloseSession = jest.spyOn(component, "handleCloseSession");

    const menuBar = compiled.querySelector("pichincha-menu-bar");
    menuBar?.dispatchEvent(new CustomEvent("closeSession"));
    fixture.detectChanges();

    expect(spyCloseSession).toHaveBeenCalled();
  });
});
