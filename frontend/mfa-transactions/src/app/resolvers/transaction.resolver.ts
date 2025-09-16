import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CrudService } from '../services/crud.service';
import { Transaction } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionResolver implements Resolve<Transaction> {

  constructor(private crudService: CrudService) {
  }

  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Promise<Transaction> {
    const { id } = route.params;
    return this.crudService.getTransactionById(id);
  }
}
