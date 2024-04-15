import { Component, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { UpdateProfileService } from 'src/app/services/update-profile.service';

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
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountsService);
  private readonly updateProfileService = inject(UpdateProfileService);
  private readonly store = inject(Store<AppState>)

  public currentUserLogged: Account = this.authenticationService.currentUserLogged() as Account;
  // TODO: cambiar rxjs por
  public uiSubscription!: Subscription;
  public dataTemp!: Account[];
  public accountList!: Account[];



  public from: number = 0;
  public page: number = 1;
  public length: number = 0;
  public pageEvent!: PageEvent;
  public pageIndex: number = 0;
  public pageSize: number = 10;
  public displayedColumns: string[] = ['avatar', 'name', 'email', 'role', 'action'];



  constructor(
    public matconfig: MatPaginatorIntl,
    public matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.matconfig.itemsPerPageLabel = 'Accounts per page';
    this.allAccounts();
    this.uiSubscription = this.store.select('ui').subscribe((state) => {
      if (state.isLoading) {
        this.allAccounts();
        this.store.dispatch(ui.isLoadingTable());
      }
    });
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  openDialog(): void {
    this.matDialog.open(RegisterAccountComponent, {
      width: '50%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  }

  allAccounts() {
    this.accountService
      .getAllAccounts(this.pageIndex + 1, this.pageSize)
      .subscribe(({ users, total }: any) => {
        this.accountList = users;
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
    this.allAccounts();
  }
 

  // changeUserState(user_to_change: string, user_logged: string) {
  //   this.userService.changeUserStatus(user_to_change, user_logged).subscribe(
  //     (resp: any) => {
  //       if (resp.ok) {
  //         success(resp.message);
  //         this.allUsers();
  //       }
  //     },
  //     (err) => {
  //       error(err.error.message);
  //     }
  //   );
  // }
  changeAccountStatus() { }
  showAccount(account: Account) {
    this.updateProfileService.userToUpdate(account);
  }
}
