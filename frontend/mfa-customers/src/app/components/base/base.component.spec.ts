import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BaseComponent } from './base.component';
import {ExternalAssetsModule} from "@pichincha/angular-sdk/external-assets";

describe('BaseComponent', () => {
  let fixture: ComponentFixture<BaseComponent>;
  let component: BaseComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[
        ExternalAssetsModule.forRoot([])
      ],
      declarations: [
        BaseComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
