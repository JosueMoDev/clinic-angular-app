import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Rol } from '../interfaces/authorized-roles.enum';
import { AuthenticationService } from '../authentication/services/authentication.service';
import { Role } from '../authentication/interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeUserGuard  {
  constructor(private authService: AuthenticationService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.checkAccess(route.data['allowedRoles']);
  }

  private checkAccess(allowedRoles: Rol): Observable<boolean> {
    console.log('Hola Mundo')
    return this.authService.isValidToken().pipe(
      tap((isAuthenticated) => {
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login');
        }
        const userRole = this.authService.userRol;
        if (!userRole) return false;
        if (Object.values(Role).includes(userRole)) {
          return true;
        } else {
          this.authService.logout();
          this.router.navigate(['/forbidden']);
          return false;
        }
      })
    );
  }
}
