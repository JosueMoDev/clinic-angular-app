import { Component } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-patient-register',
  templateUrl: './patient-register.component.html',
  styles: [
  ]
})
export class PatientRegisterComponent {

  public document_type:string = 'DUI';
  public formSubmitted:boolean = false;
  public registerPatientForm!: FormGroup;
  public type : string ='password'
  public visibility: boolean = true;
  
  ngOnInit() {

    this.registerPatientForm = this.formbuilder.group({
      document_type: ['DUI', Validators.required],
      document_number: ['', Validators.required],
      email_provider: ['@gmail.com', Validators.required],
      email: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmationPassword: [null, [Validators.required, Validators.minLength(8)]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
      lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
      phone: ['', Validators.required],
      gender: ['', Validators.required],
    });
    
    this.registerPatientForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value) 
    console.log( this.isPassworCorrect)
  }
  constructor(
    private formbuilder: FormBuilder,
    private patientService: PatientService

  ) { }

  changeVisibility() {
    this.visibility= !this.visibility;
    (this.type==='password')? this.type = 'text': this.type='password'
  }

  createPatient() {
    if ( !this.registerPatientForm.invalid ) {   

      const { document_type, document_number, email_provider, email,
        name, lastname, password, phone, gender } = this.registerPatientForm.value
        const newRegisterForm = {
          document_type,
          document_number,
          email_provider,
          email: email.trim() + email_provider,
          password,
          name: name.trim(),
          lastname: lastname.trim(),
          phone,
          gender,
          rol:'patient',
        }

      this.patientService.crearteNewPatientWithEmailAndPasswordOutside(newRegisterForm)
          
    }
     
  }

  get name() { return this.registerPatientForm.get('name'); }
  get lastname() { return this.registerPatientForm.get('lastname'); }
  get email() { return this.registerPatientForm.get('email'); } 

  get password() { return this.registerPatientForm.get('password') }
  get confirmationPassword(){ return this.registerPatientForm.get('password')}

  get isPassworCorrect() {
    return (this.registerPatientForm.get('password')?.value === this.registerPatientForm.get('confirmationPassword')?.value)
  }
  
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
  
}
