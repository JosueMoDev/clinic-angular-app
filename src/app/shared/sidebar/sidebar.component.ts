import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {
  public isSideBarOpen: boolean = false;

  toggleSideBar() {
    this.isSideBarOpen = !this.isSideBarOpen;
    console.log( this.isSideBarOpen)
  }

}
