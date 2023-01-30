import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-setter-theme',
  templateUrl: './setter-theme.component.html',
  styles: [
  ]
})
export class SetterThemeComponent {
  darkMode!: string | null;
  constructor( public theme: ThemeService){}
  ngOnInit() {
    this.darkMode = localStorage.getItem("theme");
    if (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches) { this.darkMode = 'dark' } 
  }

  toggleDarkMode() { 
    this.theme.setTheme();
    this.darkMode = localStorage.getItem("theme");
  }
}
