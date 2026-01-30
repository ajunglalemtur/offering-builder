import { Component, inject, signal } from '@angular/core';
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
  explanation: {
    title: string;
    text: string;
  };
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
  
  selectedProductType = signal<'physical' | 'digital' | null>(null);

  /**
   * Available offering types the user can choose from
   */
  offeringOptions: OfferingOption[] = [
    {
      type: 'product',
      icon: '📦',
      title: 'Product',
      description: 'Goods to sell, physical or digital',
      explanation: {
        title: 'Product Explanation',
        text: 'Works best for companies that offer concrete manufactured goods, or software products.'
      }
    },
    {
      type: 'service',
      icon: '🎯',
      title: 'Service',
      description: 'Work you provide, project-based or in installments',
      explanation: {
        title: 'Service Explanation',
        text: 'Works best for companies that offer consultancies and other work you provide.<br>Configure Pricing Tiers in the next step.'
      }
    },
    {
      type: 'subscription',
      icon: '💰',
      title: 'Subscription',
      description: 'Recurring payments for consistent value',
      explanation: {
        title: 'Subscription Explanation',
        text: 'Works best for recurring services with regular billing cycles.<br>Configure Pricing Tiers in the next step.'
      }
    }
  ];

  /**
   * Handle user clicking on an offering type card
   */
  selectOffering(offeringType: OfferingTypeValue): void {
    this.wizardState.setOfferingType(offeringType);
    
    if (offeringType !== 'product') {
      this.selectedProductType.set(null);
    }
  }

  /**
   * Handle user selecting a product type
   */
  selectProductType(productType: 'physical' | 'digital'): void {
    this.selectedProductType.set(productType);
  }

  /**
   * Check if this offering type is currently selected
   */
  isSelected(offeringType: OfferingTypeValue): boolean {
    return this.wizardState.selectedOfferingType() === offeringType;
  }

  /**
   * Check if this offering type is suggested (always show on service)
   */
  isSuggested(offeringType: OfferingTypeValue): boolean {
    return this.wizardState.suggestedOffering() === offeringType;
  }

  /**
   * Get the explanation for currently selected offering type
   */
  getSelectedExplanation(): { title: string; text: string } | null {
    const selectedType = this.wizardState.selectedOfferingType();
    if (!selectedType) return null;
    
    const option = this.offeringOptions.find(opt => opt.type === selectedType);
    return option?.explanation || null;
  }
}
