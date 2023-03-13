import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Dialog} from '@angular/cdk/dialog';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit {
  public uiSubscription!: Subscription;
  public totalUsers: number = 0;
  public userList: User[] = [];
  public dataTemp: User[] = [];
  public from: number = 0;

  

  constructor(
    private userService: UserService,
    public updateProfileService: UpdateProfileService,
    public dialog: Dialog,
    private store : Store <AppState>
  ) { 
 
  }

  ngOnInit(): void {
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
          this.totalUsers = total;
        }
      )
  }
  userPagination( from: number) {
    this.from += from;
    if (this.from < 0) {
      this.from = 0
    } else if (this.from >=this.totalUsers ) {
      this.from-=from
    }
    this.allUsers()
  }
  
}
