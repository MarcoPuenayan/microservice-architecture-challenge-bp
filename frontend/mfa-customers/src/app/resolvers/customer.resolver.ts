import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Customer } from '../interfaces/customer.interface';

@Injectable()
export class CustomerResolver implements Resolve<Customer> {

  constructor(private crudService: CrudService) {
  }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Customer> {
    const { id } = route.params;
    return this.crudService.getCustomerById(id);
  }
}
