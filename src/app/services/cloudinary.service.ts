import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  public headers: {} = this.authService.headers;
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  uploadImageCloudinary(id:string, photo:any, schema: string) { 
    return  this.http.post(`${environment.THECLINIC_API_URL}/file/photo/upload/${schema}/${id}`, photo, this.headers)
  }
}
