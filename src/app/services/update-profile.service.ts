import { inject, Injectable } from '@angular/core';

import { Clinic } from 'src/app/models/clinic.model';
import { Account } from '../authentication/interfaces';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UpdateProfileService {
  private readonly router = inject(Router)
  public userProfile!: Account;
  public clinicProfile!: Clinic;

  constructor() { }

  get userProfileToUpdate() {
    const profile = JSON.parse(sessionStorage.getItem('profile-to-show')!);
    this.userProfile = profile;
    return this.userProfile;
  }

  get clinicProfileToUpdate() {
    const profile = JSON.parse(sessionStorage.getItem('profile-to-show')!);
    this.clinicProfile = profile;
    return this.clinicProfile;
  }

  userToUpdate(profile: Account) {
    sessionStorage.setItem('profile-to-show', JSON.stringify(profile));
    this.userProfile = profile;
    this.router.navigateByUrl('/dashboard/show-account');
  }

  get currentPhoto() {
    const photo: string = sessionStorage.getItem('current-photo-profile') || '';
    return photo;
  }

  updatePhoto(photo: string) {
    sessionStorage.setItem('current-photo-profile', photo);
  }

  deletePhoto() {
    sessionStorage.removeItem('current-photo-profile');
  }

  clinicToUpdate(profile: Clinic) {
    sessionStorage.setItem('profile-to-show', JSON.stringify(profile));
    this.clinicProfile = profile;
  }
}
