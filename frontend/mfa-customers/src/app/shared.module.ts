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
import { ModalComponent } from './components/modal/modal.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { AlertModalComponent } from './components/alert-modal/alert-modal.component';

import { EventBusModule } from '@pichincha/angular-sdk/eventbus';
import { EditItemComponent } from './pages/edit-item/edit-item.component';
import { ListItemsComponent } from './pages/list-items/list-items.component';
import { ProductoResolver } from './resolvers/producto.resolver';
import { CustomerResolver } from './resolvers/customer.resolver';
import { CrudService } from './services/crud.service';
import { ModalService } from './services/modal.service';
import {
  PichinchaButtonModule,
  PichinchaInputModule,
  PichinchaReactiveControlsModule,
  PichinchaTableModule,
  PichinchaTypographyModule,
} from '@pichincha/ds-angular';

// Directivas
import { NumberOnlyDirective } from './directives/number-only.directive';
import { LettersOnlyDirective } from './directives/letters-only.directive';
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
    ModalComponent,
    ConfirmationModalComponent,
    AlertModalComponent,
    ListItemsComponent,
    EditItemComponent,
    NumberOnlyDirective,
    LettersOnlyDirective,
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
  providers: [CrudService, ModalService, ProductoResolver, CustomerResolver],
  exports: [AppComponent, BaseComponent, ModalComponent],
  schemas: [],
})
export class SharedModule {}
