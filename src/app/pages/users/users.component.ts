import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from '../../services/user.service';
import { Dialog} from '@angular/cdk/dialog';
import { ModalUserRegisterComponent } from '../components/modal-user-register/modal-user-register.component';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [
  ]
})
export class UsersComponent implements OnInit {
  public totalUsers: number = 0;
  public userList: User[] = [];
  public dataTemp: User[] = [];
  public from: number = 0;
  public loading: boolean = true;
  
  

  constructor(
    private userService: UserService,
    public dialog: Dialog,
  ) { }

  ngOnInit(): void {
    this.allUsers()
  }


  openDialog(): void {

    this.dialog.open(ModalUserRegisterComponent, {
      width: '100vh',
      minWidth: '100vh',
      backdropClass:'top'
    });
  } 


  allUsers() {
    this.loading = true;
    this.userService.allUsers(this.from)
      .subscribe(
        ({ users, total }) => {
          this.userList = users;
          this.dataTemp = users;
          this.totalUsers = total;
          this.loading = false
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
