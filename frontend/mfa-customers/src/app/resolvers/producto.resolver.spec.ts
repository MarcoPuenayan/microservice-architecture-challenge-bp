import {TestBed} from '@angular/core/testing';

import {ProductoResolver} from './producto.resolver';
import {CrudService} from "../services/crud.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

describe('ProductoResolver', () => {
  let resolver: ProductoResolver;

  let mockCrudService = {
    getById: jest.fn(),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductoResolver,
        {provide: CrudService, useValue: mockCrudService}
      ]
    });
    resolver = TestBed.inject(ProductoResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should be created', (done) => {
    const mockActivatedRoute = {
      params: {
        id: '1'
      }
    }

    mockCrudService.getById.mockResolvedValue({})

    resolver.resolve(mockActivatedRoute as unknown as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
      .then(() => {
        done()
        expect(mockCrudService.getById)
          .toHaveBeenCalled()
      })


  });
});
