import { TestBed } from '@angular/core/testing';

import { MfeAuthService } from './mfe-auth.service';

describe('MfeAuthService', () => {
  let service: MfeAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MfeAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
