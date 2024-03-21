import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

export const isAutheticated: CanActivateFn = () => {
  const authenticationService = inject( AuthenticationService );
  const router      = inject( Router );

  console.log(authenticationService.currentUserLogged())
  if (authenticationService.currentUserLogged() !== null) return true;
  
  router.navigateByUrl('/login');
  return false;

};
