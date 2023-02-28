import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {
  constructor(
    public ui: UiService,
    private authService: AuthService
  ) { }
  logout() { 
    this.authService.logout();
  }
  toggleSideBar() {
    this.ui.toggleSideBar();
  }

}
