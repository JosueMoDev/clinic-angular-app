import { Injectable } from '@angular/core';
import { Patient } from 'src/app/models/patient.model';
import { User } from 'src/app/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {
  public userProfile!: User | Patient;
  constructor() { }

  get userProfileToUpdate() {
    return this.userProfile
  }
  profileToUpdate(profile: User | Patient) { 
    this.userProfile = profile
  }
}
