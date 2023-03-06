import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  constructor(private http: HttpClient) { }

  uploadImageCloudinary(id:string, photo:any, schema: string) { 
    return  this.http.post(`${environment.THECLINIC_API_URL}/file/photo/upload/${schema}/${id}`, photo)
  }
}
