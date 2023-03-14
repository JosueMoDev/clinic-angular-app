import { Injectable } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';
import { Clinic } from '../models/clinic.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {
  public userProfile!: User | Patient;
  public clinicProfile!: Clinic;

  constructor() { }

  get userProfileToUpdate() {
    return this.userProfile
  }
  get clinicProfileToUpdate() {
    return this.clinicProfile
  }
  
  userToUpdate(profile: User | Patient) { 
    this.userProfile = profile
  }

  clinicToUpdate(profile: Clinic) { 
    this.clinicProfile = profile
  }
}
