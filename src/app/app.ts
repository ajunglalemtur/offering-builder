import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Stepper } from './components/stepper/stepper';
import { OfferingType } from './components/offering-type/offering-type';
import { CompanyInfo } from './components/company-info/company-info';
import { Details } from './components/details/details';
import { Tiers } from './components/tiers/tiers';
import { Images } from './components/images/images';
import { OfferingState } from './services/offering-state';

/**
 * Root application component
 * Manages the offering builder wizard and coordinates between steps
 */
@Component({
  selector: 'app-root',
  imports: [CommonModule, Stepper, OfferingType, CompanyInfo, Details, Tiers, Images],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  // Inject the central state management service
  state = inject(OfferingState);
  
  // Preview modal visibility
  showPreviewModal = signal(false);

  /**
   * Initialize component - check if state should be reset
   */
  ngOnInit(): void {
    const sessionKey = 'offering_wizard_session';
    const currentSession = sessionStorage.getItem(sessionKey);
    
    if (!currentSession) {
      this.state.reset();
      sessionStorage.setItem(sessionKey, 'active');
    }
    
    window.addEventListener('beforeunload', () => {
      sessionStorage.removeItem(sessionKey);
    });
  }

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

  /**
   * Show the preview modal
   */
  showPreview(): void {
    this.showPreviewModal.set(true);
  }

  /**
   * Close the preview modal
   */
  closePreview(): void {
    this.showPreviewModal.set(false);
  }

  /**
   * Get offering name for preview
   */
  getOfferingName(): string {
    const name = this.state.offeringName();
    if (name) return name;
    
    const offeringType = this.state.selectedOfferingType();
    if (offeringType) {
      return `${offeringType.charAt(0).toUpperCase()}${offeringType.slice(1)} Offering`;
    }
    
    return 'Offering Name';
  }

  /**
   * Get offering description for preview
   */
  getOfferingDescription(): string {
    const description = this.state.offeringDescription();
    return description || this.state.tagline() || 'No description provided';
  }

  /**
   * Get key features for preview
   */
  getKeyFeatures(): string[] {
    return this.state.keyFeatures().filter(f => f.trim().length > 0);
  }

  /**
   * Get card header class based on thumbnail or fallback color
   */
  getCardHeaderClass(): string {
    if (this.state.thumbnailImage()) {
      return 'has-image';
    }
    return `card-header-${this.state.fallbackColor()}`;
  }

  /**
   * Get lowest price from tiers
   */
  getLowestPrice(): number {
    const tiers = this.state.tiers();
    if (tiers.length === 0) return 0;
    
    const hasRequestQuoteOnly = tiers.some(t => t.requestQuoteOnly);
    if (hasRequestQuoteOnly) return 0;
    
    const prices = tiers.map(t => t.priceFrom).filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  /**
   * Get highest price from tiers
   */
  getHighestPrice(): number {
    const tiers = this.state.tiers();
    if (tiers.length === 0) return 0;
    
    const hasRequestQuoteOnly = tiers.some(t => t.requestQuoteOnly);
    if (hasRequestQuoteOnly) return 0;
    
    const prices = tiers.flatMap(t => [t.priceFrom, t.priceTo]).filter(p => p > 0);
    return prices.length > 0 ? Math.max(...prices) : 0;
  }

  /**
   * Get price unit
   */
  getPriceUnit(): string {
    const tiers = this.state.tiers();
    if (tiers.length === 0) return 'hr';
    
    return tiers[0].priceUnit || 'hr';
  }

  /**
   * Check if any tier has request quote only enabled
   */
  hasRequestQuoteOnly(): boolean {
    const tiers = this.state.tiers();
    return tiers.some(t => t.requestQuoteOnly);
  }
}
