import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs';

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
  public isFirstStepValid: string = '';
  public isSecondStepValid: string = '';

  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  

  public registerForm: FormGroup = this.formbuilder.group({
    personalInformation: this.formbuilder.group({
      name: ['', Validators.required],
      email: ['jonastest@mail.com', Validators.required],
      password: ['', Validators.required],
    }),
    rol: ['',Validators.required],
    file:['']

  });
  ngOnInit() {
    this.registerForm.get('personalInformation')?.statusChanges.subscribe(status => this.isFirstStepValid = status)
    this.registerForm.get('rol')?.statusChanges.subscribe( status => this.isSecondStepValid = status)
    
  }
  constructor(private formbuilder: FormBuilder, private userservice: UserService) {}


  createUser() {
    console.log(this.isFirstStepValid === 'VALID' && this.isSecondStepValid === 'VALID') 

    // this.formSubmitted = true;
    // if (!this.registerForm.invalid) {
    //   return;
    // }
    // send data
    this.userservice.crearteNewUserWithEmailAndPassword(this.registerForm.value)
     
  }

  nextPage() {
    if (  this.isFirstStepValid ==='VALID' || this.isSecondStepValid==='VALID' ) {
     
       this.currentStep = this.currentStep+1
    }
  }
  previusPage() {
    
    this.currentStep = this.currentStep-1
  }


}
