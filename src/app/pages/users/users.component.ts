import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Dialog} from '@angular/cdk/dialog';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { PageEvent } from '@angular/material/paginator';
import { MatPaginatorIntl } from '@angular/material/paginator';

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
  
  length!:number;
  pageSize = 5;
  from = 0;
  pageIndex = 0;
  pageSizeOptions = [5, 10, 25];
  
 

  hidePageSize = false;
  showPageSizeOptions = true;
  disabled = false;
  pageEvent!: PageEvent;

  constructor(
    private userService: UserService,
    public updateProfileService: UpdateProfileService,
    public dialog: Dialog,
    private store: Store<AppState>,
    public mat: MatPaginatorIntl
  ) { 
 
  }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'User per pega';
   
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

    this.dialog.open(ModalUserRegisterComponent, {
      width: '100vh',
      minWidth: '100vh',
      backdropClass:'top'
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
    if (e.pageIndex) {
      this.from=+this.pageSize
      console.log('next', this.pageSize)
      this.allUsers()
    }
    if (e.previousPageIndex ) {
      this.from-=this.pageSize
      console.log('previous', this.pageSize)
      console.log(this.pageIndex = e.previousPageIndex);
      this.allUsers()
    }
  }
  setPageSizeOptions(setPageSizeOptionsInput: string) {
    console.log(this.showPageSizeOptions)
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }
  
}
