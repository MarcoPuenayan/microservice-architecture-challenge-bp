import { DatePipe } from "@angular/common";
import { Component } from "@angular/core";
import { PichinchaTypographyModule } from "@pichincha/ds-angular";

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [
    PichinchaTypographyModule,
    DatePipe
  ],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
})
export class FooterComponent {

  now: Date = new Date();
}
