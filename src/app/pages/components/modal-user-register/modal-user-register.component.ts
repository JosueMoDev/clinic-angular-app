import { Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/app/services/user.service';
import { PatientService } from 'src/app/services/patient.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-user-register',
  templateUrl: './modal-user-register.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ]
})
export class ModalUserRegisterComponent {
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
        document_number: ['', Validators.required],
        email_provider: ['@gmail.com', Validators.required],
        email: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
        name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
        lastname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
        phone: ['', Validators.required],
        gender: ['', Validators.required],
      }),
      rol: ['', Validators.required],
      photo:[''],
      photoSrc: ['']
    });
    
    this.isPersonalInformationStepValid
    this.registerForm.get('rol')?.statusChanges.subscribe(status => this.isSecondStepValid = status)
    this.registerForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value) 
    
  }
  constructor(
    private formbuilder: FormBuilder,
    private userservice: UserService,
    private patientService: PatientService

  ) { }
  uploadPhoto(event: any) {
    const photo = event.files[0]
    this.registerForm.patchValue({ 'photoSrc': photo })
    
  }

  createUser() {
    if (this.isFirstStepValid === 'VALID' && this.isSecondStepValid === 'VALID') {   

        const { personalInformation, rol, photo } = this.registerForm.value
        const newRegisterForm = {
          document_type: personalInformation.document_type,
          document_number: personalInformation.document_number,
          email_provider: personalInformation.email_provider,
          email: personalInformation.email.trim()+ personalInformation.email_provider,
          name: personalInformation.name.trim(),
          lastname: personalInformation.lastname.trim(),
          phone: personalInformation.phone,
          gender: personalInformation.gender,
          rol,
          photo
        }
      
      if (rol==='patient') {
        this.patientService.crearteNewPatientWithEmailAndPassword(newRegisterForm)
      }
      console.log(rol)
      if (['doctor', 'operator'].includes(rol)) {
        console.log('here')
        this.userservice.crearteNewUserWithEmailAndPassword(newRegisterForm).subscribe((resp:any) => { 
          if (resp.ok) {
            if (this.registerForm.get('photoSrc')?.value) {
              console.log(resp.user.user_id)
              const formData = new FormData();
              formData.append('photo', this.registerForm.get('photoSrc')?.value)     
              this.userservice.uploadImageCloudinary(resp.user.user_id, formData).subscribe(
                (resp: any) => console.log(resp.ok),
                (err) => this.error(err.error.message)
              );
            }
          
          
            this.success
          }
        }, (err)=>this.error(err.error.message));
      }
    
    }
     
  }
  get isPersonalInformationStepValid() {
    return this.registerForm.get('personalInformation')?.statusChanges.subscribe(status => this.isFirstStepValid = status)
  }
  get name() { return this.registerForm.get('personalInformation.name'); }
  get lastname() { return this.registerForm.get('personalInformation.lastname'); }
  get email() { return this.registerForm.get('personalInformation.email'); } 
  get rol() { return this.registerForm.get('rol')?.value }
  
  error(error: string) {
    return Swal.fire({
    icon: 'error',
    title: error,
    showConfirmButton: false,
    timer:2000
    })
  }
  
  get success() {
    return Swal.fire({
      icon: 'success',
      title: 'Patient has enrolled successfull',
      showConfirmButton: false,
      timer:2000
    })
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
  
  nextPage() {
    if (  this.isFirstStepValid ==='VALID' || this.isSecondStepValid==='VALID' ) { this.currentStep = this.currentStep+1 }
  }
  previusPage() { this.currentStep = this.currentStep - 1 }
  
}
