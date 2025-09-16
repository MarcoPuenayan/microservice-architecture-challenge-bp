import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SidebarComponent } from "./sidebar.component";

describe("SidebarComponent", () => {
  let component: SidebarComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.componentRef.setInput('menuItems', [{ 
      a11yText: `Ir al Micro 'test'`,
      iconName: "home",
      label: "test",
      showIcon: true,
      isActive: true,
     }]);

    fixture.detectChanges();
  });


  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it('should emit handleClickMenuItem when pichincha-sidebar clickMenuItem is called', () => {
    const spyClickMenuItem = jest.spyOn(component, "handleClickMenuItem");
    fixture = TestBed.createComponent(SidebarComponent);
    fixture.componentRef.setInput('menuItems', [{ 
      a11yText: `Ir al Micro 'test'`,
      iconName: "home",
      label: "test",
      showIcon: true,
      isActive: true,
     }]);

    fixture.detectChanges();
    

    const sideBar = compiled.querySelector('pichincha-sidebar');
    sideBar?.dispatchEvent(new CustomEvent('clickMenuItem', { detail: { label: 'test' } }));
    fixture.detectChanges();

    expect(spyClickMenuItem).toHaveBeenCalled();
  });

});
