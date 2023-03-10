import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { User } from '../../models/user.model';
import { UpdateProfileService } from '../../services/update-profile.service';

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
    private authService: AuthService,
    public updateProfileService: UpdateProfileService,
  ) { }

  ngOnInit(): void {
    this.loggedUser = this.authService.currentUserLogged 
  }

  logout() { 
    this.authService.logout();
  }
  

}
