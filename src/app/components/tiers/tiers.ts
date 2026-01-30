import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferingState, Tier, BillingType } from '../../services/offering-state';

/**
 * Step 3: Tiers and Pricing Component
 * Manages pricing tiers for the offering including:
 * - Multiple tier creation and editing
 * - Tier details (name, features, popular badge)
 * - Pricing options (billing types, price ranges)
 * - Recommended tier structures
 */
@Component({
  selector: 'app-tiers',
  imports: [CommonModule, FormsModule],
  templateUrl: './tiers.html',
  styleUrl: './tiers.css',
})
export class Tiers {
  wizardState = inject(OfferingState);

  // UI state
  showRecommendationBox = computed(() => this.wizardState.tiers().length === 0);
  selectedRecommendedTier = signal<string>('professional');
  
  // Drag and drop state
  draggedTierId: string | null = null;
  draggedIndex: number | null = null;

  /**
   * Get the currently selected tier
   */
  get selectedTier(): Tier | null {
    return this.wizardState.getSelectedTier();
  }

  /**
   * Get list of available tiers for supersede dropdown
   */
  getAvailableTiersForSupersede(): Tier[] {
    const currentTier = this.selectedTier;
    if (!currentTier) return [];
    
    return this.wizardState.tiers().filter(t => t.id !== currentTier.id);
  }

  /**
   * Apply the recommended tier structure
   */
  useRecommendedStructure(): void {
    this.wizardState.useRecommendedTiers();
  }

  /**
   * Add a new custom tier
   */
  addCustomTier(): void {
    const tierCount = this.wizardState.tiers().length;
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      name: `Tier ${tierCount + 1}`,
      displayNameOverride: '',
      supersedeTier: '',
      bulletPoints: [''],
      isPopular: false,
      billingType: this.wizardState.selectedOfferingType() === 'product' ? 'fixed-price' : 'per-project',
      hasPriceRange: false,
      priceFrom: 0,
      priceTo: 0,
      currency: 'NZD',
      priceUnit: this.wizardState.selectedOfferingType() === 'product' ? '' : 'Project',
      requestQuoteOnly: false
    };
    this.wizardState.addTier(newTier);
  }

  /**
   * Select a tier for editing
   */
  selectTier(tierId: string): void {
    this.wizardState.selectTier(tierId);
  }

  /**
   * Delete the currently selected tier
   */
  deleteCurrentTier(): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.deleteTier(tier.id);
    }
  }

  /**
   * Update tier name
   */
  updateTierName(newName: string): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'name', newName);
    }
  }

  /**
   * Update display name override
   */
  updateDisplayNameOverride(value: string): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'displayNameOverride', value);
    }
  }

  /**
   * Update supersede tier selection
   */
  updateSupersedeTier(tierId: string): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'supersedeTier', tierId);
    }
  }

  /**
   * Add a new bullet point to the current tier
   */
  addBulletPoint(): void {
    const tier = this.selectedTier;
    if (tier) {
      const updatedBullets = [...tier.bulletPoints, ''];
      this.wizardState.updateTierProperty(tier.id, 'bulletPoints', updatedBullets);
    }
  }

  /**
   * Update a specific bullet point
   */
  updateBulletPoint(bulletIndex: number, newValue: string): void {
    const tier = this.selectedTier;
    if (tier) {
      const updatedBullets = [...tier.bulletPoints];
      updatedBullets[bulletIndex] = newValue;
      this.wizardState.updateTierProperty(tier.id, 'bulletPoints', updatedBullets);
    }
  }

  /**
   * Remove a bullet point
   */
  removeBulletPoint(bulletIndex: number): void {
    const tier = this.selectedTier;
    if (tier) {
      const updatedBullets = tier.bulletPoints.filter((_, index) => index !== bulletIndex);
      this.wizardState.updateTierProperty(tier.id, 'bulletPoints', updatedBullets);
    }
  }

  /**
   * Toggle popular status
   */
  togglePopular(isPopular: boolean): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'isPopular', isPopular);
    }
  }

  /**
   * Update billing type
   */
  updateBillingType(billingType: BillingType): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'billingType', billingType);
      
      // Update price unit based on billing type
      let priceUnit = '';
      if (billingType === 'per-project') priceUnit = 'Project';
      else if (billingType === 'hourly') priceUnit = 'hr';
      else if (billingType === 'monthly-retainer') priceUnit = 'Month';
      
      this.wizardState.updateTierProperty(tier.id, 'priceUnit', priceUnit);
    }
  }

  /**
   * Toggle price range
   */
  togglePriceRange(hasPriceRange: boolean): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'hasPriceRange', hasPriceRange);
    }
  }

  /**
   * Update price from value
   */
  updatePriceFrom(price: number): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'priceFrom', price);
    }
  }

  /**
   * Update price to value
   */
  updatePriceTo(price: number): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'priceTo', price);
    }
  }

  /**
   * Toggle request quote only
   */
  toggleRequestQuote(requestQuoteOnly: boolean): void {
    const tier = this.selectedTier;
    if (tier) {
      this.wizardState.updateTierProperty(tier.id, 'requestQuoteOnly', requestQuoteOnly);
      if (requestQuoteOnly) {
        this.wizardState.updateTierProperty(tier.id, 'priceFrom', 0);
        this.wizardState.updateTierProperty(tier.id, 'priceTo', 0);
      }
    }
  }

  /**
   * Check if billing type is available for current offering type
   */
  isBillingTypeAvailable(billingType: BillingType): boolean {
    const offeringType = this.wizardState.selectedOfferingType();
    
    if (offeringType === 'product') {
      return billingType === 'fixed-price';
    }
    
    return billingType !== 'fixed-price';
  }

  /**
   * Drag and drop handlers
   */
  onDragStart(event: DragEvent, tierId: string, index: number): void {
    this.draggedTierId = tierId;
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', (event.target as HTMLElement).innerHTML);
    }
  }

  onDragEnd(event: DragEvent): void {
    this.draggedTierId = null;
    this.draggedIndex = null;
  }

  onDragOver(event: DragEvent, index: number): void {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      this.wizardState.reorderTiers(this.draggedIndex, dropIndex);
    }
    
    this.draggedTierId = null;
    this.draggedIndex = null;
  }

  /**
   * Get recommendation text based on offering type
   */
  getRecommendationText(): string {
    const offeringType = this.wizardState.selectedOfferingType();
    
    if (offeringType === 'service') {
      return 'For services, we suggest three tiers: Starter, Professional, and Enterprise';
    } else if (offeringType === 'product') {
      return 'For products, we suggest two tiers: Base and Advanced';
    } else if (offeringType === 'subscription') {
      return 'For subscriptions, we suggest three tiers: Starter, Professional, and Enterprise';
    }
    
    return 'We suggest creating multiple pricing tiers to cater to different customer needs';
  }

  /**
   * Check if tier is selected
   */
  isTierSelected(tierId: string): boolean {
    return this.wizardState.selectedTierId() === tierId;
  }

  /**
   * Get offering type display name
   */
  getOfferingTypeDisplay(): string {
    const type = this.wizardState.selectedOfferingType();
    if (!type) return 'Service';
    return type.charAt(0).toUpperCase() + type.slice(1);
  }

 
  /**
   * Select a recommended tier option
   */
  selectRecommendedTier(tierType: string) {
    this.selectedRecommendedTier.set(tierType);
    
    

  }
}