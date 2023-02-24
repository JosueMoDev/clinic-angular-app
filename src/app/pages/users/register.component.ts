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
  public isFirstStepValid: string = '';
  public isSecondStepValid: string = '';
  public document_type:string = 'DUI';

  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  
  public registerForm: FormGroup = this.formbuilder.group({
    personalInformation: this.formbuilder.group({
      document_type: ['DUI', Validators.required],
      user_id: ['04850790-7', Validators.required],
      mail_provider:['@gmail.com', Validators.required],
      email: ['jonasmorales', Validators.required],
      name: ['jonas', Validators.required],
      lastname: ['morales', Validators.required],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
    }),
    rol: ['',Validators.required],
    file:['']

  });
  ngOnInit() {
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

  nextPage() {
    if (  this.isFirstStepValid ==='VALID' || this.isSecondStepValid==='VALID' ) {
     
       this.currentStep = this.currentStep+1
    }
  }
  previusPage() {
    
    this.currentStep = this.currentStep-1
  }


}
