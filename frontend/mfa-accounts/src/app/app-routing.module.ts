import { Routes } from '@angular/router';

import { BaseComponent } from './components/base/base.component';
import { ListItemsComponent } from './pages/list-items/list-items.component';
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { EditAccountComponent } from './pages/edit-account/edit-account.component';
import { ProductoResolver } from './resolvers/producto.resolver';
import { AccountResolver } from './resolvers/account.resolver';

export const routes: Routes = [
  {
    path: '',
    component: BaseComponent,
    children: [
      {
        path: 'list',
        component: ListItemsComponent,
      },
      {
        path: 'edit',
        component: EditItemComponent,
      },
      {
        path: 'edit-account/:id',
        component: EditAccountComponent,
        resolve: {
          account: AccountResolver,
        },
      },
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
    ],
  },
];
