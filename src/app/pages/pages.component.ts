import { Component, inject, Signal, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UiService } from '../services/ui.service';
// import { UpdateProfileService } from '../services/update-profile.service';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { Account } from '../models/account.model';
import { AccountsService } from './accounts/services/accounts.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountsService);
  @ViewChild('drawer') drawer!: MatDrawer;
  public loggedUser!: Account;
  public sideNavMenu = [
    {
      url: '/dashboard/calendar',
      icon: 'calendar_month',
      title: 'Appointment',
    },
    {
      url: '/dashboard/clinics',
      icon: 'domain',
      title: 'Clinics',
    },
    {
      url: '/dashboard/accounts',
      icon: 'person',
      title: 'Accounts',
    },
    {
      url: '/dashboard/medical-record',
      icon: 'folder-open',
      title: 'Medical Record',
    },
  ];

  constructor(
    private authService: AuthenticationService,
    public ui: UiService
  ) {}
  ngOnInit(): void {
    this.loggedUser = this.authenticationService.currentUserLogged()!;
  }

  logout() {
    this.authService.logout();
  }

  showAccount(account: Account) {
    this.accountService.showAccount(account);
  }

  toggleSideNave() {
    if (this.ui.isSideBarOpen) {
      this.ui.closeSideBar();
    } else {
      this.ui.openSideBar();
    }
  }
}
