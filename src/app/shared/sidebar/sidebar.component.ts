import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {
  constructor(public ui: UiService) { }
  
  toggleSideBar() {
    this.ui.toggleSideBar();
  }

}
