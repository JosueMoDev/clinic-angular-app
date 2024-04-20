import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  public hide = true;
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private formBuider = inject(FormBuilder);

  public loginForm: FormGroup = this.formBuider.group({
    email: [
      localStorage.getItem('user_email'),
      [Validators.required, Validators.email],
    ],
    password: [null, [Validators.required, Validators.minLength(8)]],
    rememberme: [localStorage.getItem('rememberme-state')],
  });

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
    const { email, password } = this.loginForm.value;
    this.authenticationService
      .loginWithEmailAndPassword(email, password)
      .subscribe({
        next: () => {
          this.loginForm.reset();
          this.router.navigateByUrl('/dashboard/calendar');
          success('Welcome');
        },
        error: () => error('Error intenta nuevamente'),
      });
  }
}
