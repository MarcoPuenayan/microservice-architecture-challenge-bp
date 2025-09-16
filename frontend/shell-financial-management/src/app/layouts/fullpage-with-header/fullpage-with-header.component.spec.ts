import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FullpageWithHeaderComponent } from "./fullpage-with-header.component";

describe("FullpageWithHeaderComponent", () => {
  let component: FullpageWithHeaderComponent;
  let compiled: HTMLElement;
  let fixture: ComponentFixture<FullpageWithHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullpageWithHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FullpageWithHeaderComponent);
    compiled = fixture.nativeElement as HTMLElement;
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
