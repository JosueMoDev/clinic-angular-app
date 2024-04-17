import { Component, inject, Inject } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { UpdateProfileService } from 'src/app/services/update-profile.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Account } from 'src/app/models/account.model';
import { ChangePasswordComponent } from '../accounts/components';
   



@Component({
  selector: 'app-show-account',
  templateUrl: './show-account.component.html',
  styles: [
  ]
})
export class ShowAccountComponent {
  public currentUserLogged!: Account;
  public formSub$!: Subscription;
  public isLoading: boolean = false;
  public profileSelected!: Account;
  public ShowPassWordButtom: boolean = false;
  public somethingChanged: boolean = false;
  //? User Information
  public document_type:string = 'DUI';
  public profileForm!: FormGroup;

  // ? User Photo
  public currectPhoto!: string | undefined;
  public imagenTemp!: any;
  public photoForm!: FormGroup;
  private readonly authenticationService = inject(AuthenticationService);
  constructor(
    private cloudinary: CloudinaryService,
    private formbuilder: FormBuilder,
    public updateProfileService: UpdateProfileService,
    public matDialog: MatDialog

  ) { }

  ngOnInit() {
    this.profileSelected = this.updateProfileService.userProfileToUpdate;
    this.currectPhoto = this.updateProfileService.userProfileToUpdate.photoUrl;
    this.currentUserLogged = this.authenticationService.currentUserLogged() as Account;
    this.profileForm = this.formbuilder.group({
      duiNumber: [this.profileSelected.duiNumber, Validators.required],
      email: [this.profileSelected.email, [Validators.required, Validators.minLength(10), Validators.maxLength(25), this.forbiddenInputMailValidator()]],
      name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25), this.forbiddenInputTextValidator()]],
      lastname: [this.profileSelected.lastname, [Validators.required, Validators.minLength(3), Validators.maxLength(25),this.forbiddenInputTextValidator()] ],
      phone: [this.profileSelected.phone, Validators.required],
      gender: [this.profileSelected.gender, Validators.required],
    });

    this.photoForm = this.formbuilder.group({
      photo: [''],
      photoSrc:['']
    })
    
    if ((this.profileSelected.role === 'ADMIN' && (this.profileSelected.id !== this.currentUserLogged.id ))) {
      this.profileForm.disable()
    }
   
    if ( ( (this.profileSelected.id !== this.currentUserLogged.id ))) {
      this.profileForm.disable()
    }
    

    this.ShowPassWordButtom = (this.currentUserLogged.role === this.profileSelected.id);

    this.formSub$ = this.profileForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.somethingChanged = true;
        this.hasChanges;
      } else { 
        this.somethingChanged = false;
        this.hasChanges;
      }
    });
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('profile-to-show');
    sessionStorage.removeItem('current-photo-profile');
    this.formSub$.unsubscribe;
  }

  updateProfile() {
    
    if ( !this.profileForm.errors ) {   

      const { duiNumber, email, name, lastname, phone, gender } = this.profileForm.value;
        const newUpdateForm = {
          duiNumber,
          email,
          name: name.trim(),
          lastname: lastname.trim(),
          phone,
          gender
        }
      if (this.profileSelected.role === 'PATIENT') {
        //   this.patientService.updatePatient(newUpdateForm, this.profileSelected.id).subscribe((resp: any)=> { 
        //     if (resp.ok) {
        //       this.updateProfileService.userToUpdate(resp.patient);
        //       this.profileSelected = this.updateProfileService.userProfileToUpdate;
        //       success(resp.message);
        //     }
        // }, (err: any) => {
        //     error(err.error.message);
        // });
      } else {
        // this.userService.updateAccount(newUpdateForm, this.profileSelected.id).subscribe((resp: any)=> { 
        //   if (resp.ok) {
        //     this.updateProfileService.userToUpdate(resp.user);
        //     this.profileSelected = this.updateProfileService.userProfileToUpdate;
        //     success(resp.message);
        //   }
        // }, (err: any) => {
        //   error(err.error.message);
        // });
      }
      
          
    }
     
  }

  preparePhoto(event: any) {
    const photo = event.files[0];
    this.photoForm.patchValue({ 'photoSrc': photo });
    if (!photo) {
      return this.imagenTemp = null;
    }
    const renderImg = new FileReader();
    renderImg.readAsDataURL(photo);
    renderImg.onloadend = () => { 
      this.imagenTemp = renderImg.result;
    }
    return this.imagenTemp;
  }

  startLoaddingPhoto() {
    let schema!: string;
    if (this.profileSelected.role === 'patient') {
      schema = 'patients';
    } else { schema='users'}
    this.uploadPhoto(this.profileSelected.id, schema);
  }

  deletePhoto(id: string) {
    let schema!: string;
    if (this.profileSelected.role === 'patient') {
      schema = 'patients';
    } else { schema = 'users'; }
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
            if (resp.ok) {
              this.updateProfileService.userToUpdate({ ...this.profileSelected, photoUrl: resp.photo });
              this.updateProfileService.deletePhoto();
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
            }
          },
          (err) => error(err.error.message)
        )
      }
    })
  }
  async uploadPhoto(id: string, schema: string) {
      const formData = new FormData();
      formData.append('photo', this.photoForm.get('photoSrc')?.value); 
      this.isLoading = true;    
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.isLoading = false;
              this.updateProfileService.userToUpdate({ ...this.profileSelected, photoUrl: resp.photo });
              this.updateProfileService.updatePhoto(resp.photo);
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
              formData.delete;
              this.photoForm.reset();
              this.imagenTemp = null;
            }
          },
          (err) => {
            formData.delete;
            this.photoForm.reset();
            this.isLoading = false;
            error(err.error.message);
          }
    );
  }

 

  get name() { return this.profileForm.get('name'); }
  get lastname() { return this.profileForm.get('lastname'); }
  get email() { return this.profileForm.get('email'); } 
  get duiNumber() { return this.profileForm.get('duiNumber'); }
  get phone() { return this.profileForm.get('phone'); }
  
  get hasChanges(){ return this.somethingChanged }
 
  forbiddenInputTextValidator(): ValidatorFn{
    const isForbiddenInput: RegExp = /^[a-zA-Z\s]+[a-zA-Z]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  openDialog(): void {
    this.matDialog.open(ChangePasswordComponent, {
      width: '30%',
      height: 'auto',
      hasBackdrop: true,
      disableClose: true,
      role: 'dialog',
    });
  } 

}
