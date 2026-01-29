import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stepper } from './components/stepper/stepper';
import { OfferingType } from './components/offering-type/offering-type';
import { CompanyInfo } from './components/company-info/company-info';
import { Details } from './components/details/details';
import { OfferingState } from './services/offering-state';

/**
 * Root application component
 * Manages the offering builder wizard and coordinates between steps
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, Stepper, OfferingType, CompanyInfo, Details],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // Inject the central state management service
  state = inject(OfferingState);

  /**
   * Move to the next step in the wizard
   * Called when user clicks the "Continue" button
   */
  nextStep(): void {
    this.state.nextStep();
  }

  /**
   * Go back to the previous step
   * Called when user clicks the "Previous" button
   */
  previousStep(): void {
    this.state.previousStep();
  }

  /**
   * Cancel the wizard and reset everything
   * Called when user clicks the "Cancel" button
   */
  cancel(): void {
    this.state.reset();
  }
}
