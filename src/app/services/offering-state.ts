import { Injectable, signal } from '@angular/core';

/**
 * Represents a single step in the offering creation wizard
 */
export interface Step {
  id: number;
  label: string;
  completed: boolean;
}

/**
 * Types of offerings users can create
 */
export type OfferingType = 'product' | 'service' | 'subscription' | null;

/**
 * Company classification types
 */
export type CompanyType = 'Company Type' | 'Consultancy';

/**
 * Business categories for filtering and classification
 */
export type Category = 'Law' | 'Notary' | 'Legal Services';

/**
 * Central state management service for the offering builder wizard
 * Uses Angular signals for reactive state updates
 */
@Injectable({
  providedIn: 'root',
})
export class OfferingState {
  // Total number of steps in the wizard
  private readonly TOTAL_STEPS = 4;
  private readonly FIRST_STEP = 1;

  // Initial steps configuration
  private readonly INITIAL_STEPS: Step[] = [
    { id: 1, label: 'Offering Type', completed: false },
    { id: 2, label: 'Details', completed: false },
    { id: 3, label: 'Tiers', completed: false },
    { id: 4, label: 'Images', completed: false }
  ];

  // Wizard step state
  steps = signal<Step[]>(this.INITIAL_STEPS);
  currentStep = signal<number>(this.FIRST_STEP);

  // User selections
  selectedOfferingType = signal<OfferingType>(null);
  
  // Company information
  companyType = signal<CompanyType>('Consultancy');
  selectedCategories = signal<Category[]>(['Law', 'Notary', 'Legal Services']);
  
  // Suggested offering type
  suggestedOffering = signal<OfferingType>('service');

  /**
   * Navigate to a specific step in the wizard
   */
  setCurrentStep(stepNumber: number): void {
    if (stepNumber >= this.FIRST_STEP && stepNumber <= this.TOTAL_STEPS) {
      this.currentStep.set(stepNumber);
    }
  }

  /**
   * Update the user's selected offering type
   */
  setOfferingType(offeringType: OfferingType): void {
    this.selectedOfferingType.set(offeringType);
  }

  /**
   * Mark a specific step as completed
   */
  completeStep(stepId: number): void {
    this.steps.update(allSteps => 
      allSteps.map(step => 
        step.id === stepId ? { ...step, completed: true } : step
      )
    );
  }

  /**
   * Advance to the next step in the wizard
   * Automatically marks the current step as completed
   */
  nextStep(): void {
    const currentStepNumber = this.currentStep();
    
    if (currentStepNumber < this.TOTAL_STEPS) {
      // Mark current step as completed before moving forward
      this.completeStep(currentStepNumber);
      this.setCurrentStep(currentStepNumber + 1);
    }
  }

  /**
   * Go back to the previous step in the wizard
   */
  previousStep(): void {
    const currentStepNumber = this.currentStep();
    
    if (currentStepNumber > this.FIRST_STEP) {
      this.setCurrentStep(currentStepNumber - 1);
    }
  }

  /**
   * Reset the wizard to its initial state
   * Clears all user selections and returns to step 1
   */
  reset(): void {
    this.currentStep.set(this.FIRST_STEP);
    this.selectedOfferingType.set(null);
    this.steps.set([...this.INITIAL_STEPS]);
  }
}
