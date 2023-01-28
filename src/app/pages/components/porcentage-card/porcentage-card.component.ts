import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-porcentage-card',
  templateUrl: './porcentage-card.component.html',
  styles: [
  ]
})
export class PorcentageCardComponent {

  @Input() icon!: string;
  @Input() classIcon!: string;
  @Input() title!: string;
  @Input() total: number[] =[0, 0];
  @Input() amouth: number = 0;

  @Output() porcentajeCitas: number[] = [];
  @Output() totalAmout: number = 0;
  
  
  ngOnInit() {
    this.classIcon = this.classIcon;
    this.title = this.title;
    this.porcentajeCitas = this.total;
    this.totalAmout = this.amouth
  }
    
  porcentage: number = 55.5
  

  get getPorcentage() { 
    return `${ this.porcentage}%`
  }

  changePorcentage(value: number) { 
    
    if (this.porcentage >= 100 && value >= 0) {
       this.porcentage = 100;
    }
    if (this.porcentage <= 0 && value < 0) {
       this.porcentage = 0;
    }
    this.porcentage = this.porcentage + value; 
  }
}
