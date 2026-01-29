import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingState } from '../../services/offering-state';

/**
 * Company Information Display Component
 * Shows company type, consultancy info, and categories
 * Appears at the top of Step 1 (Offering Type selection)
 */
@Component({
  selector: 'app-company-info',
  imports: [CommonModule],
  templateUrl: './company-info.html',
  styleUrl: './company-info.css',
})
export class CompanyInfo {
  // Access company data from wizard state
  wizardState = inject(OfferingState);
}
