import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  darkMode!: string | null;

  ngOnInit() {
      this.darkMode = localStorage.getItem('theme');
    
      if (this.darkMode === null) { 
        this.darkMode = 'light';
        return localStorage.removeItem('theme');
      }
      if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

  toggleDarkMode() { 
    
    (document.documentElement.classList.toggle('dark'))
      ? localStorage.setItem('theme', 'dark')
      : localStorage.setItem('theme', 'light')
      this.darkMode = localStorage.getItem('theme');
  }

}
