import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "../shared/layout/header/header";
import { Sidebar } from "../shared/layout/sidebar/sidebar";

@Component({
  selector: 'app-application',
  imports: [RouterOutlet, Header, Sidebar],
  templateUrl: './application.html',
  styleUrl: './application.scss',
})
export class Application {
  public isSidebarExpanded: boolean = false;

  /**
   * @description This function is used to toggle the sidebar
   * @param isExpanded - Whether sidebar is expanded
   * @author PSI-II
   * @returns void
   */
  onSidebarToggle(isExpanded: boolean): void {
    this.isSidebarExpanded = isExpanded;
  }

}
