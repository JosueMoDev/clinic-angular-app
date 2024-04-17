import { Component, inject} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';

import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { AuthenticationService } from '../../authentication/services/authentication.service';
import { AccountsService } from '../accounts/services/accounts.service';
import { RegisterAccountComponent } from './components/register-account/register-account.component';
import { Account } from 'src/app/models/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
})
export class AccountsComponent {
  private readonly authenticationService = inject(AuthenticationService);
  private readonly accountService = inject(AccountsService);
  private readonly store = inject(Store<AppState>)

  public currentUserLogged: Account = this.authenticationService.currentUserLogged() as Account;
  public uiSubscription!: Subscription;
  public dataTemp: Account[] = [];
  public accountList: Account[] = [];



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
      .subscribe(({ accounts, pagination }) => {
        this.accountList = accounts;
        this.dataTemp = accounts;
        this.length = pagination.total;
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
 
  changeAccountStatus() { }
  showAccount(account: Account) {
    this.accountService.showAccount(account);
  }
}
