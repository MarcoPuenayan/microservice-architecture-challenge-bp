import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ExternalAssetsModule } from '@pichincha/angular-sdk/external-assets';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { StorageModule } from '@pichincha/angular-sdk/storage';
import { BaseComponent } from './components/base/base.component';

import { EventBusModule } from '@pichincha/angular-sdk/eventbus';
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { ListItemsComponent } from './pages/list-items/list-items.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { ProductoResolver } from './resolvers/producto.resolver';
import { TransactionResolver } from './resolvers/transaction.resolver';
import { CrudService } from './services/crud.service';
import { ReportsService } from './services/reports.service';
import {
  PichinchaButtonModule,
  PichinchaInputModule,
  PichinchaReactiveControlsModule,
  PichinchaTableModule,
  PichinchaTypographyModule,
} from '@pichincha/ds-angular';
enum EStorageType {
  LOCAL = 'local',
  SESSION = 'session',
  MEMORY = 'memory',
}
const ConfigStorage = {
  storageType: EStorageType.SESSION,
  secretKey: environment.storage.key,
};

@NgModule({
  declarations: [
    AppComponent,
    BaseComponent,
    ListItemsComponent,
    EditItemComponent,
    ReportsComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    ExternalAssetsModule,
    FormsModule,
    ReactiveFormsModule,
    StorageModule.forRoot(ConfigStorage),
    EventBusModule,
    PichinchaTypographyModule,
    PichinchaButtonModule,
    PichinchaTableModule,
    PichinchaInputModule,
    PichinchaReactiveControlsModule,
  ],
  providers: [CrudService, ReportsService, ProductoResolver, TransactionResolver],
  exports: [AppComponent, BaseComponent],
  schemas: [],
})
export class SharedModule {}
