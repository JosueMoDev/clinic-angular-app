import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {
  loggedUser!: User;
  constructor(
    public ui: UiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.currentUserLogged 
  }

  logout() { 
    this.authService.logout();
  }
  

}
