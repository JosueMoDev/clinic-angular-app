import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';


import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { AccountsService } from '../../accounts/services/accounts.service';


@Component({
  selector: 'app-password-recovery',
  templateUrl: './password-recovery.component.html',
  styles: []
})
export class PasswordRecoveryComponent {
  public oldPasswordForm!: FormGroup;
  public newPasswordForm!: FormGroup;

  public currentUserLogged!: any
  public type : string ='password'
  public visibility: boolean = true;
  public isOldPasswordValid: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthenticationService,
    private userService: AccountsService,
    public matdialogRef: MatDialogRef<PasswordRecoveryComponent>
  ) { }
  
  ngOnInit(): void {
    this.newPasswordForm = this.formbuilder.group({
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmationPassword: [null, [Validators.required, Validators.minLength(8)]],
    })
    this.oldPasswordForm = this.formbuilder.group({
      oldPassword: [null, [Validators.required, Validators.minLength(8)]],
    })

    this.password?.disable();
    this.confirmationPassword?.disable();
    this.currentUserLogged = this.authService.currentUserLogged
  }
  changeVisibility() {
    this.visibility= !this.visibility;
    (this.type==='password')? this.type = 'text': this.type='password'
  }
  get oldPassword() { return this.oldPasswordForm.get('oldPassword') }
  get password() { return this.newPasswordForm.get('password') }
  get confirmationPassword(){ return this.newPasswordForm.get('confirmationPassword')}
  get isPassworCorrect() {
    return (this.newPasswordForm.get('password')?.value === this.newPasswordForm.get('confirmationPassword')?.value)
  }

  

  passwordRecoveryForm() {
    if (!this.newPasswordForm?.invalid) {
      if (this.currentUserLogged.rol === 'patient') {
        // this.PatientService.changePassword(this.currentUserLogged.id, this.password?.value).subscribe(
        //   (resp: any)=>{
        //     if (resp.ok) {
        //       this.isOldPasswordValid = false;
        //       this.oldPassword?.enable();
        //       this.password?.disable();
        //       this.confirmationPassword?.disable();
        //       this.oldPasswordForm.reset();
        //       this.newPasswordForm.reset();
        //       success(resp.message)
        //     }
        //   },(err:any)=>{ error(err.error.message)}
        // )
      } else {
        // this.userService.changePassword().subscribe(
        //   (resp: any)=>{
        //     if (resp.ok) {
        //       this.isOldPasswordValid = false;
        //       this.oldPassword?.enable();
        //       this.password?.disable();
        //       this.confirmationPassword?.disable();
        //       this.oldPasswordForm.reset();
        //       this.newPasswordForm.reset();
        //       success(resp.message)
        //     }
        //   },(err:any)=>{ error(err.error.message)}
        // )
      }
    }
  }
 

}
