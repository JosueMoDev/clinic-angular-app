import { CommonModule } from '@angular/common';
import { Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
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
export class RegisterComponent implements OnInit{
  public isFirstStepValid: string = '';
  public isSecondStepValid: string = '';
  public document_type:string = 'DUI';

  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  
  public registerForm!: FormGroup;
    
 
     
  ngOnInit() {
    this.registerForm= this.formbuilder.group({
      personalInformation: this.formbuilder.group({
        document_type: ['DUI', Validators.required],
        user_id: ['', Validators.required],
        mail_provider: ['@gmail.com', Validators.required],
        email: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
        lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
        phone: ['', Validators.required],
        gender: ['', Validators.required],
      }),
      rol: ['',Validators.required],
      file:['']
  
    });

    this.registerForm.get('personalInformation')?.statusChanges.subscribe(status => this.isFirstStepValid = status)
    this.registerForm.get('rol')?.statusChanges.subscribe(status => this.isSecondStepValid = status)
    this.registerForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value) 
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

  get name() { return this.registerForm.get('personalInformation.name'); }
  get lastname() { return this.registerForm.get('personalInformation.lastname'); }
  get mail() { return this.registerForm.get('personalInformation.email'); } 

  forbiddenInputTextValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z\s]+[a-zA-Z]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
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
