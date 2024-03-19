import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule , Validators} from '@angular/forms';
import { NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { SharedModule } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AngularMaterialModule } from 'src/app/angular-material.module';
import { AuthService } from 'src/app/services/auth.service';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { environment } from 'src/environments/environment';
declare const google: any;


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    AngularMaterialModule,
    CommonModule,
    HttpClientModule,
    NgxMaskDirective,
    NgxMaskPipe,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit, AfterViewInit {
  public loginForm!: FormGroup;
  public currentRoute!: string;
  public routeSubs$!: Subscription;
  public visibility: boolean = true;
  public error: any = error;
  public type: string = 'password';
  hide = true;

  @ViewChild('googleLogin') googleLogin!: ElementRef;

  constructor(
    private formBuider: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private _ngZone: NgZone
  ) {
    this.routeSubs$ = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
      }
    });
    this.routeSubs$.unsubscribe;
  }

  ngOnInit(): void {
    this.loginForm = this.formBuider.group({
      email: [
        localStorage.getItem('user_email'),
        [Validators.required, Validators.email],
      ],
      password: [null, [Validators.required, Validators.minLength(8)]],
      rememberme: [localStorage.getItem('rememberme-state')],
    });
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: environment.GOOGLE_CLIENT_KEY,
      callback: (resp: any) => this.handleCredentialResponse(resp),
    });
    google.accounts.id.renderButton(this.googleLogin.nativeElement, {
      theme: 'dark',
      size: 'large',
    });
  }

  async handleCredentialResponse(response: any) {
    await this.authService
      .googleSingIn(response.credential, this.currentRoute)
      .subscribe(
        (response: any) => {
          if (response.ok) {
            this._ngZone.run(() => {
              this.router.navigate(['/']);
            });
            success(response.message);
          }
        },
        (error: any) => this.error(error.error.message)
      );
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get rememberme() {
    return this.loginForm.get('rememberme')?.value;
  }

  loginWithEmailAndPassword() {
    this.authService
      .loginWithEmailAndPassword(this.loginForm.value, this.currentRoute)
      .subscribe(
        (resp: any) => {
          if (resp.account) {
            if (this.rememberme) {
              localStorage.setItem('rememberme-state', this.rememberme);
              localStorage.setItem('user_email', this.email?.value);
            } else if (!this.rememberme) {
              localStorage.removeItem('rememberme-state');
              localStorage.removeItem('user_email');
            }
            this.loginForm.reset();
            this.router.navigateByUrl('/');
            success(resp.message);
          }
        },
        (error) => {
          this.error(error.error.message);
        }
      );
  }
}
