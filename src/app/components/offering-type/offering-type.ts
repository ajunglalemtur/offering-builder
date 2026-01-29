import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingState, OfferingType as OfferingTypeValue } from '../../services/offering-state';

/**
 * Represents a selectable offering option in the UI
 */
interface OfferingOption {
  type: OfferingTypeValue;
  icon: string;
  title: string;
  description: string;
}

/**
 * Step 1: Offering Type Selection Component
 * Allows users to choose between Product, Service, or Subscription
 */
@Component({
  selector: 'app-offering-type',
  imports: [CommonModule],
  templateUrl: './offering-type.html',
  styleUrl: './offering-type.css',
})
export class OfferingType {
  wizardState = inject(OfferingState);

  /**
   * Available offering types the user can choose from
   */
  offeringOptions: OfferingOption[] = [
    {
      type: 'product',
      icon: '📦',
      title: 'Product',
      description: 'Goods to sell, physical or digital'
    },
    {
      type: 'service',
      icon: '🎯',
      title: 'Service',
      description: 'Work you provide, project-based or in installments'
    },
    {
      type: 'subscription',
      icon: '💰',
      title: 'Subscription',
      description: 'Recurring payments for consistent value'
    }
  ];

  /**
   * Handle user clicking on an offering type card
   */
  selectOffering(offeringType: OfferingTypeValue): void {
    this.wizardState.setOfferingType(offeringType);
  }

  /**
   * Check if this offering type is currently selected
   */
  isSelected(offeringType: OfferingTypeValue): boolean {
    return this.wizardState.selectedOfferingType() === offeringType;
  }

  /**
   * Check if this offering type is suggested
   */
  isSuggested(offeringType: OfferingTypeValue): boolean {
    return this.wizardState.suggestedOffering() === offeringType;
  }
}
