import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-clinic',
  templateUrl: './register-clinic.component.html',
  styles: [
  ]
})
export class RegisterClinicComponent {
  
  public information!: boolean;
  public currentStep : number = 1  ;
  public address!: boolean;
  public registerClinicForm!: FormGroup;

  ngOnInit() {

    this.registerClinicForm= this.formbuilder.group({
      information: this.formbuilder.group({
        register_number: ['', Validators.required],
        name: ['Geronimo 1990', [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
        phone: ['', Validators.required],
      }),
      address: this.formbuilder.group({
        country: ['EL Salvador', Validators.required],
        province: ['Cabañas', [Validators.required]],
        city: ['Sensuntepeque', Validators.required],
        street:[]
      }),
      photo: ['']
    });
    
    this.registerClinicForm.get('information')?.valueChanges.subscribe(value => this.information = value) 
    this.registerClinicForm.get('address')?.valueChanges.subscribe(value => this.information = value) 
    console.log(this.isFirstStepValid)
  
  }
  constructor(
    private formbuilder: FormBuilder,

  ) { }
  get isFirstStepValid() {
    return (this.information === this.address)
  }
  get name() { return this.registerClinicForm.get('information.name'); }



  forbiddenInputMailValidator(): ValidatorFn {
    const isForbiddenInput: RegExp = /^[a-zA-Z0-9]+[\sa-zA-Z0-9]+$/
    return (control: AbstractControl): ValidationErrors | null => {
      const isforbidden = isForbiddenInput.test(control.value);
      return !isforbidden ? {forbiddenName: {value: control.value}} : null;
    };
  }
  
  nextPage() {
    if (  this.isFirstStepValid) { this.currentStep = this.currentStep+1 }
  }
  previusPage() { this.currentStep = this.currentStep - 1 }

  createClinic() { 

  }
  
}
