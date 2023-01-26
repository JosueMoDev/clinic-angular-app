import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeSwicherService {
  theme: any = localStorage.getItem('theme') ;

  constructor(
  ) { }

  
  setLightTheme() {
    localStorage.setItem('theme', 'light');
    this.theme = localStorage.getItem('theme')
  }
  setDarkTheme() {
    localStorage.setItem('theme', 'dark');
    this.theme = localStorage.getItem('theme')
  }
 
}
