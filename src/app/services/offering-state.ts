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
 * Billing types available for service offerings
 */
export type BillingType = 'per-project' | 'hourly' | 'monthly-retainer' | 'fixed-price';

/**
 * Represents a single pricing tier for an offering
 */
export interface Tier {
  id: string;
  name: string;
  displayNameOverride: string;
  supersedeTier: string;
  bulletPoints: string[];
  isPopular: boolean;
  billingType: BillingType;
  hasPriceRange: boolean;
  priceFrom: number;
  priceTo: number;
  currency: string;
  priceUnit: string;
  requestQuoteOnly: boolean;
}

/**
 * Available fallback colors for offering cards
 */
export type FallbackColor = 'burgundy' | 'orange' | 'green' | 'magenta' | 'gray';

/**
 * Represents an uploaded or gallery image
 */
export interface OfferingImage {
  id: string;
  url: string;
  file?: File;
}

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

  // Offering details
  offeringName = signal<string>('');
  tagline = signal<string>('');
  keyFeatures = signal<string[]>([]);
  offeringDescription = signal<string>('');
  tags = signal<string[]>([]);

  // Tier management
  tiers = signal<Tier[]>([]);
  selectedTierId = signal<string | null>(null);

  // Image management
  thumbnailImage = signal<OfferingImage | null>(null);
  galleryImages = signal<OfferingImage[]>([]);
  fallbackColor = signal<FallbackColor>('burgundy');

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
    this.companyType.set('Consultancy');
    this.selectedCategories.set(['Law', 'Notary', 'Legal Services']);
    this.suggestedOffering.set('service');
    this.offeringName.set('');
    this.tagline.set('');
    this.keyFeatures.set([]);
    this.offeringDescription.set('');
    this.tags.set([]);
    this.tiers.set([]);
    this.selectedTierId.set(null);
    this.thumbnailImage.set(null);
    this.galleryImages.set([]);
    this.fallbackColor.set('burgundy');
  }

  /**
   * Add a new tier to the offering
   */
  addTier(tier: Tier): void {
    const currentTiers = this.tiers();
    this.tiers.set([...currentTiers, tier]);
    this.selectedTierId.set(tier.id);
  }

  /**
   * Remove a tier by its ID
   */
  deleteTier(tierId: string): void {
    const currentTiers = this.tiers();
    const updatedTiers = currentTiers.filter(t => t.id !== tierId);
    this.tiers.set(updatedTiers);
    
    if (this.selectedTierId() === tierId) {
      this.selectedTierId.set(updatedTiers.length > 0 ? updatedTiers[0].id : null);
    }
  }

  /**
   * Select a tier by its ID
   */
  selectTier(tierId: string): void {
    this.selectedTierId.set(tierId);
  }

  /**
   * Update a property of a specific tier
   */
  updateTierProperty<K extends keyof Tier>(tierId: string, property: K, value: Tier[K]): void {
    this.tiers.update(allTiers =>
      allTiers.map(tier =>
        tier.id === tierId ? { ...tier, [property]: value } : tier
      )
    );
  }

  /**
   * Get currently selected tier
   */
  getSelectedTier(): Tier | null {
    const tierId = this.selectedTierId();
    if (!tierId) return null;
    return this.tiers().find(t => t.id === tierId) || null;
  }

  /**
   * Reorder tiers by moving a tier from one index to another
   */
  reorderTiers(fromIndex: number, toIndex: number): void {
    const currentTiers = [...this.tiers()];
    const [movedTier] = currentTiers.splice(fromIndex, 1);
    currentTiers.splice(toIndex, 0, movedTier);
    this.tiers.set(currentTiers);
  }

  /**
   * Load recommended tier structure based on offering type
   */
  useRecommendedTiers(): void {
    const offeringType = this.selectedOfferingType() || this.suggestedOffering();
    
    if (offeringType === 'service') {
      const serviceTiers: Tier[] = [
        {
          id: 'starter',
          name: 'Starter',
          displayNameOverride: '',
          supersedeTier: '',
          bulletPoints: ['Basic features', 'Email support'],
          isPopular: false,
          billingType: 'per-project',
          hasPriceRange: true,
          priceFrom: 500,
          priceTo: 1000,
          currency: 'NZD',
          priceUnit: 'Project',
          requestQuoteOnly: false
        },
        {
          id: 'professional',
          name: 'Professional',
          displayNameOverride: '',
          supersedeTier: 'starter',
          bulletPoints: ['More AI Credits', 'Integration for Salesforce and Quickbooks'],
          isPopular: true,
          billingType: 'monthly-retainer',
          hasPriceRange: true,
          priceFrom: 1600,
          priceTo: 2400,
          currency: 'NZD',
          priceUnit: 'Month',
          requestQuoteOnly: false
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          displayNameOverride: '',
          supersedeTier: 'professional',
          bulletPoints: ['All features', 'Priority support', 'Custom integrations'],
          isPopular: false,
          billingType: 'monthly-retainer',
          hasPriceRange: false,
          priceFrom: 5000,
          priceTo: 5000,
          currency: 'NZD',
          priceUnit: 'Month',
          requestQuoteOnly: true
        }
      ];
      this.tiers.set(serviceTiers);
      this.selectedTierId.set('professional');
    } else if (offeringType === 'product') {
      const productTiers: Tier[] = [
        {
          id: 'base',
          name: 'Base',
          displayNameOverride: '',
          supersedeTier: '',
          bulletPoints: ['Standard features', 'Basic support'],
          isPopular: false,
          billingType: 'fixed-price',
          hasPriceRange: false,
          priceFrom: 550,
          priceTo: 550,
          currency: 'NZD',
          priceUnit: '',
          requestQuoteOnly: false
        },
        {
          id: 'advanced',
          name: 'Advanced',
          displayNameOverride: '',
          supersedeTier: 'base',
          bulletPoints: ['Advanced features', 'Premium support', 'Extended warranty'],
          isPopular: true,
          billingType: 'fixed-price',
          hasPriceRange: false,
          priceFrom: 950,
          priceTo: 950,
          currency: 'NZD',
          priceUnit: '',
          requestQuoteOnly: false
        }
      ];
      this.tiers.set(productTiers);
      this.selectedTierId.set('base');
    } else if (offeringType === 'subscription') {
      const subscriptionTiers: Tier[] = [
        {
          id: 'starter',
          name: 'Starter',
          displayNameOverride: '',
          supersedeTier: '',
          bulletPoints: ['Essential features', 'Email support', 'Monthly billing'],
          isPopular: false,
          billingType: 'monthly-retainer',
          hasPriceRange: false,
          priceFrom: 29,
          priceTo: 29,
          currency: 'NZD',
          priceUnit: 'Month',
          requestQuoteOnly: false
        },
        {
          id: 'professional',
          name: 'Professional',
          displayNameOverride: '',
          supersedeTier: 'starter',
          bulletPoints: ['All Starter features', 'Priority support', 'Advanced analytics', 'Team collaboration'],
          isPopular: true,
          billingType: 'monthly-retainer',
          hasPriceRange: false,
          priceFrom: 79,
          priceTo: 79,
          currency: 'NZD',
          priceUnit: 'Month',
          requestQuoteOnly: false
        },
        {
          id: 'enterprise',
          name: 'Enterprise',
          displayNameOverride: '',
          supersedeTier: 'professional',
          bulletPoints: ['All Professional features', 'Dedicated account manager', 'Custom integrations', 'SLA guarantee'],
          isPopular: false,
          billingType: 'monthly-retainer',
          hasPriceRange: false,
          priceFrom: 199,
          priceTo: 199,
          currency: 'NZD',
          priceUnit: 'Month',
          requestQuoteOnly: false
        }
      ];
      this.tiers.set(subscriptionTiers);
      this.selectedTierId.set('professional');
    }
  }

  /**
   * Set the thumbnail image
   */
  setThumbnailImage(image: OfferingImage | null): void {
    this.thumbnailImage.set(image);
  }

  /**
   * Add a gallery image
   */
  addGalleryImage(image: OfferingImage): void {
    const currentImages = this.galleryImages();
    this.galleryImages.set([...currentImages, image]);
  }

  /**
   * Remove a gallery image by ID
   */
  removeGalleryImage(imageId: string): void {
    const currentImages = this.galleryImages();
    this.galleryImages.set(currentImages.filter(img => img.id !== imageId));
  }

  /**
   * Set the fallback color for the offering card
   */
  setFallbackColor(color: FallbackColor): void {
    this.fallbackColor.set(color);
  }
}
