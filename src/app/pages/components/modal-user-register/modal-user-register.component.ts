import { Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UserService } from 'src/app/services/user.service';
import { PatientService } from 'src/app/services/patient.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { success, error } from 'src/app/helpers/sweetAlert.helper';


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
  public document_type: string = 'DUI';
  public email_provider: string = '@gmail.com';
  public currentStep : number = 1  ;
  public formSubmitted:boolean = false;
  public registerForm!: FormGroup;
  public imagenTemp!: any;
 
  ngOnInit() {

    this.registerForm= this.formbuilder.group({
      personalInformation: this.formbuilder.group({
        document_type: [this.document_type, Validators.required],
        document_number: ['', Validators.required],
        email_provider: [this.email_provider, Validators.required],
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
    private patientService: PatientService,
    private cloudinary : CloudinaryService

  ) { }
  preparePhoto(event: any) {
    const photo = event.files[0]
    this.registerForm.patchValue({ 'photoSrc': photo })
    if (!photo) {
      return this.imagenTemp = null
    }
    const renderImg = new FileReader();
    renderImg.readAsDataURL(photo);
    renderImg.onloadend = () => { 
      this.imagenTemp = renderImg.result;
    }
    return this.imagenTemp
  }
  async uploadPhoto(id: string, schema: string ) {
      const formData = new FormData();
      formData.append('photo', this.registerForm.get('photoSrc')?.value)     
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              success(resp.message)
              formData.delete,
              this.imagenTemp = null;
            }
          },
          (err) => error(err.error.message)
    );
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
        this.patientService.crearteNewPatientWithEmailAndPassword(newRegisterForm).subscribe(async (resp:any) => { 
          if (resp.ok && this.registerForm.get('photoSrc')?.value) { 
            await this.uploadPhoto(resp.patient.patient_id, 'patients')     
          }
          success(resp.message)
          this.currentStep = 1;
          this.registerForm.reset()
        }, (err)=>error(err.error.message));
      }
      if (['doctor', 'operator'].includes(rol)) {
        this.userservice.crearteNewUserWithEmailAndPassword(newRegisterForm).subscribe(async (resp:any) => { 
          if (resp.ok && this.registerForm.get('photoSrc')?.value) { 
            await this.uploadPhoto(resp.user.user_id, 'users')     
          }
          success(resp.message)
          this.currentStep = 1;
          this.registerForm.reset()
        }, (err)=>error(err.error.message));
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
  get photo() { return this.registerForm.get('photo') }
  
  

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
