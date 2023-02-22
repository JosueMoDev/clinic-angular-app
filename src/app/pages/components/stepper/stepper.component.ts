
import {
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styles: [
  ]
})
export class StepperComponent implements OnInit{
  @Input()
  currentStep!: number;

  steps = [1, 2, 3, 4];

  ngOnInit(): void {}
}
