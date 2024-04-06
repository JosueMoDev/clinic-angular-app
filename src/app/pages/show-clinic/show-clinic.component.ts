import { Component, inject } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';

import Swal from 'sweetalert2';

import { CloudinaryService } from 'src/app/services/cloudinary.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { UpdateProfileService } from 'src/app/services/update-profile.service';

import { Clinic} from 'src/app/models/clinic.model';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-show-clinic',
  templateUrl: './show-clinic.component.html',
  styles: [
  ]
})
  
export class ShowClinicComponent {
  public formSub$!: Subscription;
  public profileSelected!: Clinic;
  public isLoading: boolean = false;
  public somethingChanged: boolean = false;
  // ?Information Form
  public cities!: string[];
  public profileForm!: FormGroup;
  public provinces!: string[];

  // ?Photo Form
  public currectPhoto!: string | undefined;
  public imagenTemp!: any
  public photoForm!: FormGroup;

  constructor(
    private clinicService: ClinicService,
    private cloudinary: CloudinaryService,
    private formbuilder: FormBuilder,
    public updateProfileService: UpdateProfileService

  ) { }

  ngOnInit() {
    this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
    this.currectPhoto = this.updateProfileService.clinicProfileToUpdate.photoUrl;
    this.profileForm = this.formbuilder.group({
      information: this.formbuilder.group({
        registerNumber: [this.profileSelected.registerNumber, Validators.required],
        name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
        phone: [this.profileSelected.phone, Validators.required],
      }),
      address: this.formbuilder.group({
        state: [this.profileSelected.address.state, [Validators.required]],
        city: [this.profileSelected.address.city, Validators.required],
        street:[this.profileSelected.address.street, Validators.required]
      })
    });

    this.photoForm = this.formbuilder.group({
      photoUrl: [this.profileSelected.photoUrl, Validators.required]
    })
   
    this.formSub$ = this.profileForm.statusChanges.subscribe(value => {
      if (value === 'VALID') {
        this.somethingChanged = true;
        this.hasChanges;
      } else { 
        this.somethingChanged = false;
        this.hasChanges;
      }
    })
  }

  ngOnDestroy(): void {
    sessionStorage.removeItem('profile-to-show');
    sessionStorage.removeItem('current-photo-profile');
    this.formSub$.unsubscribe;
  }
  get hasChanges(){ return this.somethingChanged }


  updateProfile() {
    if ( !this.profileForm.errors ) {   
      const { information, address } = this.profileForm.value;
      const newUpdateForm = {
        registerNumber: information.registerNumber,
        phone: information.phone,
        name: information.name,
        province: address.province,
        city: address.city,
        street: address.street
      }
      this.clinicService.updateClinic(newUpdateForm, this.profileSelected.id).subscribe((resp: any)=> { 
        if (resp.ok) {
          this.updateProfileService.clinicToUpdate(resp.clinic);
          this.profileSelected = this.updateProfileService.clinicProfileToUpdate;
          success(resp.message);
        }
      }, (err: any) => {
        error(err.error.message);
      });    
    }
  }

  get name() { return this.profileForm.get('information.name'); }
  get street() { return this.profileForm.get('address.street'); }
  get registerNumber() { return this.profileForm.get('information.registerNumber');}
  get phone_number(){return this.profileForm.get('information.phone');}
  get state() {return this.profileForm.get('address.state');}
  get city() { return this.profileForm.get('address.city');}



  deletePhoto(id: string) {
    let schema: string='clinics';
    Swal.fire({
      title: 'Are you sure?, Do you want to delete your current photo',
      icon: 'warning',
      iconColor: '#dc2626',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#dc2626',
      width: '75%',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.cloudinary.destroyImageCloudinary(id, schema).subscribe(
          (resp: any) => {
            if (resp.ok) {
              this.updateProfileService.clinicToUpdate({ ...this.profileSelected, photoUrl: resp.photo });
              this.updateProfileService.deletePhoto();
              this.currectPhoto = this.updateProfileService.currentPhoto;
              success(resp.message);
            }
          },
          (err) => error(err.error.message)
        );
      }
    });
  }
  
  forbiddenInputTextValidator(): ValidatorFn{
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }


}
