import { Component } from '@angular/core';
import { MfeAuthService } from './services/mfe-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(private mfeAuthService: MfeAuthService) {
    // El servicio se instancia automáticamente al inyectarlo
  }
}
