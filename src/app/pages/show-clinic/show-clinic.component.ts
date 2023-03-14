import { Component } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { success, error } from 'src/app/helpers/sweetAlert.helper';
import provicesAndCities from '../../../assets/ElSalvadorCities.json';
import { ClinicService } from '../../services/clinic.service';
import { UpdateProfileService } from '../../services/update-profile.service';
import { Clinic} from 'src/app/models/clinic.model';
import { CloudinaryService } from 'src/app/services/cloudinary.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show-clinic',
  templateUrl: './show-clinic.component.html',
  styles: [
  ]
})
export class ShowClinicComponent {
  public profileForm!: FormGroup;
  public photoForm!: FormGroup;
  public profileSelected!: Clinic;
  public currectPhoto!: string | undefined;
  public imagenTemp!: any
  public isLoading: boolean = false;

  public provinces!: string[];
  public cities!: string[];

  ngOnInit() {

    this.profileForm = this.formbuilder.group({
      information: this.formbuilder.group({
        register_number: [this.profileSelected.register_number, Validators.required],
        name: [this.profileSelected.name, [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        phone: [this.profileSelected.phone, Validators.required],
      }),
      address: this.formbuilder.group({
        country: [{ value:'El Salvador', disabled: true }],
        province: [this.profileSelected.province, [Validators.required]],
        city: [this.profileSelected.city, Validators.required],
        street:[this.profileSelected.street, Validators.required]
      })
    });

    this.photoForm = this.formbuilder.group({
      photo: [''],
      photoSrc:['']
    })
    
    this.provinces = provicesAndCities.map( ({province}) => province)
  }
  constructor(
    private formbuilder: FormBuilder,
    private clinicService: ClinicService,
    private cloudinary: CloudinaryService,
    public updateProfileService: UpdateProfileService

  ) { 
    this.profileSelected = updateProfileService.clinicProfileToUpdate;
    this.currectPhoto = updateProfileService.clinicProfileToUpdate.photo;

  }

  updateProfile() {
    
  }

  get name() { return this.profileForm.get('information.name'); }
  get street() { return this.profileForm.get('address.street'); }
  get nameProvince() { return this.profileForm.get('address.province')?.value; }
  get citiesByProvince() {
   
    const province = provicesAndCities.filter(province => province.province === this.nameProvince)
    return province[0].cities
 
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
    let schema: string='clinics';
    this.uploadPhoto(this.profileSelected.clinic_id, schema)
  }

  deletePhoto(id: string) {
    let schema: string='clinics';
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

  forbiddenInputTextValidator(): ValidatorFn{
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9._]+[a-zA-Z0-9._]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }


}