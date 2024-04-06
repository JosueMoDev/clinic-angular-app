import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../authentication/services/authentication.service';


@Injectable({
  providedIn: 'root'
})
export class SearchingService {
  public headers: {} = this.authService.headers
  constructor(
    private http: HttpClient,
    private authService: AuthenticationService
  ) { }

  getResponse(term: string) {
    return this.http.get(`${environment.THECLINIC_API_URL}/search/${term}`, this.headers)
  }
}
