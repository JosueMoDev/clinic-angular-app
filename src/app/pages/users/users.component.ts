import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { MatDialog} from '@angular/material/dialog';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { UiService } from 'src/app/services/ui.service';
import { AuthService } from 'src/app/services/auth.service';
import { Patient } from 'src/app/models/patient.model';
import { success, error } from '../../helpers/sweetAlert.helper';



@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit {
  public uiSubscription!: Subscription;
  public userList: User[] = [];
  public dataTemp: User[] = [];
  
  public length!:number;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex:number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public disabled: boolean = false;
  public pageEvent!: PageEvent;
  public currentUserLogged!: User | Patient


  constructor(
    private userService: UserService,
    private store: Store<AppState>,
    private ui: UiService,
    private authService: AuthService,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog,
    public mat: MatPaginatorIntl
  ) { 
 
  }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Users per page';
    this.currentUserLogged = this.authService.currentUserLogged;
    this.allUsers()
    this.uiSubscription = this.store.select('ui').subscribe(state => {
      if (state.isLoading) {
        this.allUsers();
      }
    })
    
  }

  ngOnDestroy(): void {
    this.uiSubscription.unsubscribe();
  }

  openDialog(): void {
    this.ui.currentUserType('')
    this.matDialog.open(ModalUserRegisterComponent, {
      width: '100%',
      height: '90%',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 

 


  allUsers() {
    this.userService.allUsers(this.from)
    .subscribe(
      ({ users, total }) => {
          this.userList = users;
          this.dataTemp = users;
          this.length = total;
        }
      )
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageIndex=e.pageIndex
    
    if (this.pageEvent.pageIndex > this.pageEvent.previousPageIndex!) {
      this.from = this.from + this.pageSize
    } else { 
      this.from = this.from - this.pageSize
    }
    this.allUsers()

  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log(this.showPageSizeOptions)
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  changeUserState(user_to_change: string, user_logged: string ) {
    this.userService.changeUserStatus(user_to_change, user_logged).subscribe((resp: any)=> { 
      if (resp.ok) {
        success(resp.message)
        this.allUsers();
      }
    }, (err)=>{error(err.error.message)});
  }


  
}
