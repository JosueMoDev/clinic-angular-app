import { Component } from '@angular/core';
import { UiService } from '../services/ui.service';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [
  ]
})
export class PagesComponent {
  constructor(
    public ui: UiService
  ){}
}
