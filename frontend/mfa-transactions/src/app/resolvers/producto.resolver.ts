import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {CrudService} from "../services/crud.service";
import {Product} from "../interfaces/product.interface";

@Injectable()
export class ProductoResolver implements Resolve<Product> {

  constructor(private crudService: CrudService) {
  }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Product> {
    const {id} = route.params
    return this.crudService.getById(id);
  }
}

