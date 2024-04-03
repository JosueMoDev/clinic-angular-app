import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Role } from '../interfaces';


export const authorizedAccountGuard: CanActivateFn = (route, state) => {
  const authenticationService = inject(AuthenticationService);
  const router = inject(Router);

  const allowedRoles: Role[] = route.data['allowedRoles'];
 return authenticationService.isValidToken().pipe(
   tap((isAuthenticated) => {
     if (!isAuthenticated) {
      router.navigateByUrl('/login');
     }
     const userRole = authenticationService.userRol;
     if (!userRole) return false;
     const role = Role[userRole as keyof typeof Role];
     if (allowedRoles.includes(role)) {
       return true;
     } else {
       authenticationService.logout();
       router.navigate(['/forbidden']);
       return false;
     }
   })
 );
  
};


