import { Component, inject, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';


import { UserService } from 'src/app/services/user.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { UiService } from 'src/app/services/ui.service';


import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Account } from 'src/app/authentication/interfaces';
import { AuthenticationService } from '../../authentication/services/authentication.service';
import { AccountsService } from '../accounts/services/accounts.service';
import { RegisterAccountComponent } from './components/register-account/register-account.component';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  public currentUserLogged!: Account;
  public uiSubscription!: Subscription;
  // ? Use's Table
  public dataTemp!: Account[];
  public userList!: Account[];

  //? Angular Material Paginator

  public from: number = 0;
  public hidePageSize: boolean = false;
  public length!: number;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 5;
  public pageSizeOptions: number[] = [5, 10, 25];
  public showPageSizeOptions: boolean = true;
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountsService);

  constructor(
    private store: Store<AppState>,
    private ui: UiService,
    private userService: UserService,
    public matconfig: MatPaginatorIntl,
    public matDialog: MatDialog,
    public updateProfileService: UpdateProfileService
  ) {}

  ngOnInit(): void {
    this.matconfig.previousPageLabel = '';
    this.matconfig.nextPageLabel = '';
    this.matconfig.itemsPerPageLabel = 'Users per page';
    this.currentUserLogged = this.authenticationService.currentUserLogged() as Account;
    this.allUsers();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.allUsers();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  openDialog(): void {
    this.ui.currentUserType('');
    this.matDialog.open(RegisterAccountComponent, {
      width: '100%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }

  allUsers() {
    this.accountService
      .allUsers(this.from)
      .subscribe(({ users, total }: any) => {
        this.userList = users;
        this.dataTemp = users;
        this.length = total;
      });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex = e.pageIndex;

    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize;
    } else {
      this.from = this.from - this.pageSize;
    }
    this.allUsers();
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput
        .split(',')
        .map((str) => +str);
    }
  }

  changeUserState(user_to_change: string, user_logged: string) {
    this.userService.changeUserStatus(user_to_change, user_logged).subscribe(
      (resp: any) => {
        if (resp.ok) {
          success(resp.message);
          this.allUsers();
        }
      },
      (err) => {
        error(err.error.message);
      }
    );
  }
}
