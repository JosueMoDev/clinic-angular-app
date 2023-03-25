import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from 'src/app/store/actions/ui.actions';

import { AuthService } from 'src/app/services/auth.service';
import { ClinicService } from 'src/app/services/clinic.service';
import { CloudinaryService } from 'src/app/services/cloudinary.service';

import {  User } from 'src/app/models/user.model';

import { success, error } from 'src/app/helpers/sweetAlert.helper';
import provicesAndCities from 'src/assets/ElSalvadorCities.json';




 
@Component({
  selector: 'app-register-clinic',
  templateUrl: './register-clinic.component.html',
  styles: [
  ]
})
export class RegisterClinicComponent {
  public currentStep : number = 1  ;
  public registerClinicForm!: FormGroup;
  public provinces!: string[];
  public cities!: string[];
  public informationStep!: string;
  public addressStep!: string;
  public loggedUser!: User;
  public imagenTemp!: any;
 
  ngOnInit() {

    this.loggedUser = this.authService.currentUserLogged;

    this.registerClinicForm = this.formbuilder.group({
      information: this.formbuilder.group({
        register_number: ['', Validators.required],
        name: ['Geronimo 1990', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        phone: ['', Validators.required],
      }),
      address: this.formbuilder.group({
        country: [{ value:'El Salvador', disabled: true }],
        province: ['', [Validators.required]],
        city: ['', Validators.required],
        street:[null, Validators.required]
      }),
      photo: [''],
      photoSrc:['']
    });

    this.provinces = provicesAndCities.map( ({province}) => province)
    this.registerClinicForm.get('address.city')?.disable();  
  }
  
  constructor(
    private formbuilder: FormBuilder,
    private authService: AuthService,
    private clinicService: ClinicService,
    private cloudinary: CloudinaryService,
    public matdialogRef: MatDialogRef<RegisterClinicComponent>,
    private store : Store <AppState>
  ) { }

  get nameProvince() { return this.registerClinicForm.get('address.province')?.value; }
  get country(){ return this.registerClinicForm.get('address.country')}
  get isFirstStepValid() {
    this.registerClinicForm.get('information')?.statusChanges.subscribe(status => this.informationStep = status)
    this.registerClinicForm.get('address')?.statusChanges.subscribe(status => this.addressStep = status)
    return( this.informationStep ==='VALID' && this.addressStep ==='VALID')
  }
  get photo(){ return this.registerClinicForm.get('photo')?.value}
  get name() { return this.registerClinicForm.get('information.name'); }
  get citiesByProvince() {
    if (this.nameProvince) {
      this.registerClinicForm.get('address.city')?.enable();
      const province = provicesAndCities.filter(province => province.province === this.nameProvince)
      return province[0].cities
    }
    return;
  }
  get register_number() { return this.registerClinicForm.get('information.register_number') }
  get phone_number(){return this.registerClinicForm.get('information.phone')}
  get province() {return this.registerClinicForm.get('address.province')}
  get city() { return this.registerClinicForm.get('address.city') }
  get street(){ return this.registerClinicForm.get('address.street')}

  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9]+[\sa-zA-Z0-9]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  preparePhoto(event: any) {
    const photo = event.files[0]
    this.registerClinicForm.patchValue({ 'photoSrc': photo })
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
  async uploadPhoto(id: string, schema: string) {
    this.store.dispatch(ui.isLoadingTable())
      const formData = new FormData();
      formData.append('photo', this.registerClinicForm.get('photoSrc')?.value)     
        await this.cloudinary.uploadImageCloudinary(id, formData, schema ).subscribe(
          (resp: any) => {
            if (resp.ok) {
              success(resp.message)
              this.store.dispatch(ui.isLoadingTable())
              formData.delete,
              this.imagenTemp = null;
            }
          },
          (err) => error(err.error.message)
    );
  }

  
  nextPage() {
    if (  this.isFirstStepValid) { this.currentStep = this.currentStep+1 }
  }
  previusPage() { this.currentStep = this.currentStep - 1 }

  createClinic() { 
    const { information, address } = this.registerClinicForm.value
    const newClinicRegisterForm = {
      register_number: information.register_number,
      phone: information.phone,
      name: information.name,
      address,
      user_id: this.loggedUser.id,
      user_rol: this.loggedUser.rol
 
    }

    this.clinicService.createClinic(newClinicRegisterForm).subscribe(async (resp:any) => { 
      if (resp.ok && this.registerClinicForm.get('photoSrc')?.value) { 
        await this.uploadPhoto(resp.clinic.clinic_id, 'clinics')  
        
      }
      success(resp.message)
      this.store.dispatch(ui.isLoadingTable())
      this.currentStep = 1;
      this.matdialogRef.close();
      this.registerClinicForm.reset()
    }, (err)=>error(err.error.message));
  }
}
