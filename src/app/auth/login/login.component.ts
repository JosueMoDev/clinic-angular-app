import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm!: FormGroup;
  public error_message: any = null;
  
  @ViewChild('googleLogin') googleLogin!: ElementRef;

  constructor(
    private formBuider: FormBuilder,
    private userService: UserService,
    private router: Router,
    private _ngZone: NgZone
  ) { } 

  ngOnInit(): void {
    this.loginForm = this.formBuider.group({
      email: [localStorage.getItem('user_email'), [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      rememberme:[localStorage.getItem('rememberme-state')]
    }) 
  }

  ngAfterViewInit(): void {
    this.googleInit()
  }

  googleInit() { 
    google.accounts.id.initialize({
        client_id: environment.GOOGLE_CLIENT_KEY,
        callback: (resp:any) => this.handleCredentialResponse(resp)
    });
    google.accounts.id.renderButton(
        this.googleLogin.nativeElement,
        { theme: "outline", size: "large" }  
    );
  }

  async handleCredentialResponse(response: any) {
    await this.userService.googleSingIn(response.credential)
      .subscribe(
      (response: any )=> {
        if (response.ok) {
          sessionStorage.setItem('userToken', response.token);
          this._ngZone.run(
            () => { 
             this.router.navigate(['/'])
          })}
      },
      (error: any) => { 
        this.error_message = error.error.message
      }
    )
  }


  get email() { return this.loginForm.get('email') }
  get password(){ return this.loginForm.get('password')}
  get errors() { return this.error_message }
  get rememberme() { return this.loginForm.get('rememberme')?.value }

  

  
  loginWithEmailAndPassword() { 
    this.userService.loginWithEmailAndPassword(this.loginForm.value)
      .subscribe( 
        (resp) => {
          if (resp.ok) {
            if (this.rememberme) {
              localStorage.setItem('rememberme-state', this.rememberme);
              localStorage.setItem('user_email', this.email?.value);
            } else if (!this.rememberme) {
              localStorage.removeItem('rememberme-state');
              localStorage.removeItem('user_email');
            }
            sessionStorage.setItem('userToken', resp.token)
            this.loginForm.reset()
            this.router.navigateByUrl('/') 
            
          }
        },
        (error) => {this.error_message = error.error.message}
      );}

}
