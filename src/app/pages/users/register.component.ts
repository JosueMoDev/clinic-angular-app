import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class RegisterComponent {
  public isFirstStepValid = false;
  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  

  public registerForm: FormGroup = this.formbuilder.group({
    name: ['', Validators.required],
    email: ['jonastest@mail.com', Validators.required],
    password: ['', Validators.required],
    file:['']

  });

  constructor(private formbuilder: FormBuilder, private userservice: UserService) {}

  firstStep() { 
    if (
      !this.registerForm.get('name')?.invalid &&
      !this.registerForm.get('email')?.invalid
      && !this.registerForm.get('password')?.invalid) {
       console.log(this.isFirstStepValid=true)
    }
  }

  createUser() {
    this.formSubmitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    // send data
    this.userservice.crearteNewUserWithEmailAndPassword(this.registerForm.value)
     
  }

  nextPage() {
    if (  this.isFirstStepValid ) {
     
       this.currentStep = this.currentStep+1
    }
  }
  previusPage() {
    this.isFirstStepValid=false
    this.currentStep = this.currentStep-1
  }


}
