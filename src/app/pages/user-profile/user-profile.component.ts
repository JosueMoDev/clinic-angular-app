import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { UserService } from '../../services/user.service';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import Swal from 'sweetalert2';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';


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
  public letShowPassWordField: boolean = false;
  public photoForm!: FormGroup;
  public imagenTemp!: any
  public isLoading: boolean = false;


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

    this.photoForm = this.formbuilder.group({
      photo: [''],
      photoSrc:['']
    })
    
    this.profileForm.get('personalInformation.document_type')?.valueChanges.subscribe(value => this.document_type = value);
    this.letShowPassWordField = (this.authService.currentUserLogged.id === this.profileSelected.id )
   
  }

  

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private cloudinary: CloudinaryService,
    public updateProfileService: UpdateProfileService

  ) { 
    this.profileSelected = updateProfileService.userProfileToUpdate;
    this.currectPhoto = updateProfileService.userProfileToUpdate.photo;

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

  preparePhoto(event: any) {
    const photo = event.files[0]
    this.photoForm.patchValue({ 'photoSrc': photo })
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

  startLoaddingPhoto() {
    let schema!: string;
    if (this.profileSelected.rol === 'patient') {
      schema = 'patients'
    } else { schema='users'}
    this.uploadPhoto(this.profileSelected.id, schema)
  }

  deletePhoto(id: string) {
    let schema!: string;
    if (this.profileSelected.rol === 'patient') {
      schema = 'patients'
    } else { schema='users'}
    Swal.fire({
      title: 'Are you sure?, Do you want to delete your current photo',
      icon: 'warning',
      iconColor: '#dc2626',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#dc2626',
      width:'75%',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cloudinary.destroyImageCloudinary(id, schema).subscribe(
          (resp: any) => {
            if (resp.ok) { success(resp.message) }
          },
          (err) => error(err.error.message)
        )
      }
    })
  }
  async uploadPhoto(id: string, schema: string) {
      const formData = new FormData();
      formData.append('photo', this.photoForm.get('photoSrc')?.value) 
      this.isLoading = true;    
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.isLoading = false;
              success(resp.message)
              formData.delete,
              this.photoForm.reset()
              this.imagenTemp = null;
            }
          },
          (err) => {
            formData.delete,
            this.photoForm.reset()
            this.isLoading = false;
            error(err.error.message)
          }
    );
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
