import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public darkMode!: string | null;
  public isSideBarOpen: boolean = false;

  constructor() { 

    this.darkMode = localStorage.getItem('theme');
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
      if(!localStorage.getItem('theme')){ this.darkMode='dark'}
    } else {
      document.documentElement.classList.remove('dark')
      if(!localStorage.getItem('theme')){ this.darkMode='light'}
    }

  }
  

  setTheme() { 
    (document.documentElement.classList.toggle('dark'))
      ? localStorage.setItem('theme', 'dark')
      : localStorage.setItem('theme', 'light')
    this.darkMode = localStorage.getItem('theme');   
  }

  toggleSideBar() {
    this.isSideBarOpen = !this.isSideBarOpen;
  }
}
