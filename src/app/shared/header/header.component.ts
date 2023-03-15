import { Component } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { AuthService } from 'src/app/services/auth.service';
import { UpdateProfileService } from '../../services/update-profile.service';
import { User } from '../../models/user.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
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
  toggleNavMenu() { 
    if (this.ui.isNavMenuOpen) {
      this.ui.closeNavMenu()
    } else {
      this.ui.openNavMenu()
    }
  }
  toggleSideNave() { 
    if (this.ui.isSideBarOpen) {
      this.ui.closeSideBar()
    } else {
      this.ui.openSideBar()
    }
  }

}
