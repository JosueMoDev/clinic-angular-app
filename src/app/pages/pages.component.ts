import { Component, inject, Signal, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UiService } from '../services/ui.service';
// import { UpdateProfileService } from '../services/update-profile.service';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { Account } from '../models/account.model';

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
    private authService: AuthenticationService,
    // public updateProfileService: UpdateProfileService,
    public ui: UiService
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authenticationService.currentUserLogged()!;
  }

  logout() {
    this.authService.logout();
  }

  updateAccount(account: Account) {
    
  }

  toggleSideNave() {
    if (this.ui.isSideBarOpen) {
      this.ui.closeSideBar();
    } else {
      this.ui.openSideBar();
    }
  }
}
