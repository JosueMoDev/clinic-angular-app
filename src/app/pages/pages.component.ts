import { Component, inject, Signal, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { AuthService } from '../services/auth.service';
import { UiService } from '../services/ui.service';
import { UpdateProfileService } from '../services/update-profile.service';
import { Account } from '../authentication/interfaces';
import { AuthenticationService } from '../authentication/services/authentication.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent {
  private readonly authenticationService = inject(AuthenticationService);
  @ViewChild('drawer') drawer!: MatDrawer;
  public loggedUser!: Account;
  public sideNavMenu!: any;

  constructor(
    private authService: AuthService,
    public updateProfileService: UpdateProfileService,
    public ui: UiService
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authenticationService.currentUserLogged()!;
    this.sideNavMenu = this.authService.currentSideNav;
  }

  logout() {
    this.authService.logout();
  }

  toggleSideNave() {
    if (this.ui.isSideBarOpen) {
      this.ui.closeSideBar();
    } else {
      this.ui.openSideBar();
    }
  }
}
