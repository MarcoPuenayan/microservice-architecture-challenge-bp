import { CommonModule } from "@angular/common";
import { Component, inject, input, output } from "@angular/core";
import {
  PichinchaIconModule,
  PichinchaSidebarModule,
  PichinchaTypographyModule,
} from "@pichincha/ds-angular";
import { Router, RouterModule } from "@angular/router";
import { MenuItemType } from "@pichincha/ds-core";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [
    PichinchaIconModule,
    PichinchaTypographyModule,
    PichinchaSidebarModule,
  ],
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent {
  menuItems = input.required<MenuItemType[]>();
  onClickItemSidebar = output<string>();

  handleClickMenuItem(event: Event) {
    const { detail } = event as CustomEvent<MenuItemType>;
    this.onClickItemSidebar.emit(detail.label);
  }
}
