import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { tap } from 'rxjs';

export const isAutheticated: CanActivateFn = () => {
  const authenticationService = inject( AuthenticationService );
  const router      = inject( Router );
   
  return authenticationService.isValidToken().pipe(
    tap((isAuthenticated) => {
      if (!isAuthenticated) {
        router.navigateByUrl('/login');
      }
    })
  );

};
