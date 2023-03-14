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
  
  public length!:number;
  public pageSize: number = 5;
  public from: number = 0;
  public pageIndex:number = 0;
  public pageSizeOptions: number[] = [5, 10, 25];
  
  public hidePageSize: boolean = false;
  public showPageSizeOptions: boolean = true;
  public disabled: boolean = false;
  public pageEvent!: PageEvent;
 


  constructor(
    private userService: UserService,
    private store: Store<AppState>,
    public updateProfileService: UpdateProfileService,
    public dialog: Dialog,
    public mat: MatPaginatorIntl
  ) { 
 
  }

  ngOnInit(): void {
    this.mat.previousPageLabel = '';
    this.mat.nextPageLabel = '';
    this.mat.itemsPerPageLabel = 'Users per page';
   
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
  
}
