import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../components/footer/footer.component";
import { HeaderComponent } from "../../components/header/header.component";
import { EventBusModule, EventBusService } from "@pichincha/angular-sdk/eventbus";
import { LazyElementsModule } from "@pichincha/angular-sdk/custom-elements/lazy-elements";

@Component({
  selector: "app-fullpage-with-header",
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
    LazyElementsModule
  ],
  templateUrl: "./fullpage-with-header.component.html",
  styleUrls: ["./fullpage-with-header.component.scss"],
})
export class FullpageWithHeaderComponent {}
