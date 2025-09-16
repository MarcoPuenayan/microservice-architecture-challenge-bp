import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EmptyComponent } from "./empty.component";

describe("Component: EmptyComponent", () => {
  let component: EmptyComponent;
  let fixture: ComponentFixture<EmptyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Should be created", () => {
    expect(component).toBeTruthy();
  });
});
