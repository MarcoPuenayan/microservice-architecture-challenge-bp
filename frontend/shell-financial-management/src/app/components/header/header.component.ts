import { Component, input, output } from "@angular/core";
import { PichinchaMenuBarModule } from "@pichincha/ds-angular";
import { LoggedUser } from "@pichincha/ds-core";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [PichinchaMenuBarModule],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  loggedUser = input.required<LoggedUser>();
  onClickCloseSession = output()

  handleCloseSession() {
    this.onClickCloseSession.emit();
  }
}
