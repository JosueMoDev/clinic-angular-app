import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarLabel,
  MatSnackBarActions,
  MatSnackBarAction,
  MatSnackBarRef,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-snackbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    CommonModule
  ],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css',
})
export class SnackbarComponent {
  public snackBarRef = inject(MatSnackBarRef);
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; duration: number, isSuccess: boolean }
  ) {}
}
