import { Component, OnInit, ViewEncapsulation } from "@angular/core";
// import { injectWebComponent } from "./helper/inject-web-component"; // Usar cuando se tenga un microfrontend de tipo Web Component.

@Component({
  selector: "app-root-base",
  templateUrl: "./app.component.html",
  encapsulation: ViewEncapsulation.ShadowDom,
})
export class AppComponent implements OnInit {
  title = "angular-container";
  total: number | undefined;

  url: string = "";

  ngOnInit(): void {
   /*  injectWebComponent(); // Usar cuando se tenga un microfrontend de tipo Web Component. */
  }
}
