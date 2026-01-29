import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingState } from '../../services/offering-state';

/**
 * Visual step indicator component
 * Displays progress through the wizard with numbered circles and checkmarks
 */
@Component({
  selector: 'app-stepper',
  imports: [CommonModule],
  templateUrl: './stepper.html',
  styleUrl: './stepper.css',
})
export class Stepper {
  // Access wizard state to display current progress
  wizardState = inject(OfferingState);
}
