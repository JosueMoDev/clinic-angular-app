import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  // ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { StepperComponent } from '../components/stepper/stepper.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent implements OnInit {

  // public formSubmitted = false;

  // public registerForm: FormGroup = this.formBuilder.group({
  //   name: ['', [Validators.required, Validators.minLength(3)]],
  //   email: ['', [Validators.required, Validators.email]],
  //   password: ['', [Validators.required, Validators.minLength(7)]],
  //   confirmationPassword: ['', [Validators.required, Validators.minLength(7)]],
  //   terms:[false, Validators.required]
  // }
  //   // , { asyncValidatos: this.arePasswordsEquals('password', 'confirmationPassword') }
  // );
  // constructor(
  //   private formBuilder: FormBuilder,
  //   private userService: UserService,
  // ) { }

  // validateFields(field: string): boolean {

  //   return (this.registerForm.get(field)?.invalid) ? true : false
  // }
  // validatePasswords() {
  //   const password = this.registerForm.get('password')
  //   const confirmation = this.registerForm.get('confirmationPassword')

  //   return((!(password?.invalid || confirmation?.invalid) && (password?.value === confirmation?.value)) || !this.formSubmitted) ? true : false
  // }

  // termsAndCons() {
  //   return !this.registerForm.get('terms')?.value && this.formSubmitted
  // }
  
  // createUser() {
  //   this.formSubmitted = true;
  //   if(!(this.registerForm.valid && this.registerForm.get('terms')?.value))return
  //   this.userService.crearteNewUserWithEmailAndPassword(this.registerForm.value)
  // }
  
  currentStep = 1;
  lastPage = false;
  form!: FormGroup;
  billingPeriod: 'monthly' | 'yearly' = 'monthly';
  arcadePlan = 9;
  advancedPlan = 12;
  proPlan = 15;
  onlineService = 1;
  storage = 2;
  customProfile = 2;
  total = 9;

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern("^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$"),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(
          '^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$'
        ),
      ]),

      plan: new FormControl('arcadePlan'),

      billingPeriod: new FormControl(false),

      onlineService: new FormControl(null),
      storage: new FormControl(null),
      customProfile: new FormControl(null),
    });
  }

  changeBillingPeriod() {
    let isYearly = this.form.controls['billingPeriod'].value;
    if (isYearly) {
      this.billingPeriod = 'yearly';
      this.arcadePlan = 90;
      this.advancedPlan = 120;
      this.proPlan = 150;
      this.onlineService = 10;
      this.storage = 20;
      this.customProfile = 20;
    } else {
      this.billingPeriod = 'monthly';
      this.arcadePlan = 9;
      this.advancedPlan = 12;
      this.proPlan = 15;
      this.onlineService = 1;
      this.storage = 2;
      this.customProfile = 2;
    }
  }

  onSubmit() {
    this.lastPage = true;
    this.form.reset();
  }

  changePage(isNextPage: boolean) {
    const addOns =
      (this.form.get('onlineService')?.value && this.onlineService) +
      (this.form.get('storage')?.value && this.storage) +
      (this.form.get('customProfile')?.value && this.customProfile);

    if (!isNextPage) {
      return this.currentStep--;
    } else {
      if (this.currentStep === 3) {
        if (this.form.get('plan')?.value === 'arcadePlan') {
          this.total = this.arcadePlan + addOns;
        } else if (this.form.get('plan')?.value === 'advanced') {
          this.total = this.advancedPlan + addOns;
        } else {
          this.total = this.proPlan + addOns;
        }
      }
      return this.currentStep++;
    }
  }

}
