import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { DepositAccount } from '../interfaces/deposit-account.interface';

@Injectable()
export class AccountResolver implements Resolve<DepositAccount> {
  constructor(private crudService: CrudService) {}

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<DepositAccount> {
    const { id } = route.params;
    return this.crudService.getAccountById(id);
  }
}
