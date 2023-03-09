import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { success } from 'src/app/helpers/sweetAlert.helper';
import { error } from '../../helpers/sweetAlert.helper';
import { UserService } from '../../services/user.service';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styles: [
  ]
})
export class UserProfileComponent {
  public document_type:string = 'DUI';
  public formSubmitted:boolean = false;
  public profileForm!: FormGroup;
  public type : string ='password'
  public visibility: boolean = true;
  public profileSelected: User | Patient;
  public currectPhoto!: string | undefined;
  
  ngOnInit() {

    this.profileForm = this.formbuilder.group({
      document_type: [this.profileSelected.document_type, Validators.required],
      document_number: [this.profileSelected.document_number, Validators.required],
      email_provider: [this.profileSelected.email_provider, Validators.required],
      email: [this.profileSelected.email, [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
      password: [null, [Validators.required, Validators.minLength(8)]],
      confirmationPassword: [null, [Validators.required, Validators.minLength(8)]],
      name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
      lastname: [this.profileSelected.lastname, [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
      phone: [this.profileSelected.phone, Validators.required],
      gender: [this.profileSelected.gender, Validators.required],
    });


    
    this.profileForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value) 
  }
  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    public updateProfileService: UpdateProfileService

  ) { 
    this.profileSelected = updateProfileService.userProfileToUpdate;
    this.currectPhoto = updateProfileService.userProfileToUpdate.photo
  }

  changeVisibility() {
    this.visibility= !this.visibility;
    (this.type==='password')? this.type = 'text': this.type='password'
  }

  updateProfile() {
    if ( !this.profileForm.invalid ) {   

      const { document_type, document_number, email_provider, email,
        name, lastname, password, phone, gender } = this.profileForm.value
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

      // this.userService.crearteNewPatientWithEmailAndPasswordOutside(newRegisterForm).subscribe((resp: any)=> { 
      //   if (resp) { success(resp.message) }
      // }, (err:any)=>{error(err.error.message)});
          
    }
     
  }

 

  get name() { return this.profileForm.get('name'); }
  get lastname() { return this.profileForm.get('lastname'); }
  get email() { return this.profileForm.get('email'); } 

  get password() { return this.profileForm.get('password') }
  get confirmationPassword(){ return this.profileForm.get('password')}

  get isPassworCorrect() {
    return (this.profileForm.get('password')?.value === this.profileForm.get('confirmationPassword')?.value)
  }
  
  forbiddenInputTextValidator(): ValidatorFn{
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
