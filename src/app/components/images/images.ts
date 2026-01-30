import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OfferingState, FallbackColor, OfferingImage } from '../../services/offering-state';

/**
 * Step 4: Images and Media Component
 * Manages offering images including:
 * - Thumbnail image upload
 * - Gallery images (multiple)
 * - Fallback color selection when no thumbnail
 */
@Component({
  selector: 'app-images',
  imports: [CommonModule],
  templateUrl: './images.html',
  styleUrl: './images.css',
})
export class Images {
  wizardState = inject(OfferingState);

  // Available fallback colors
  fallbackColors: Array<{ color: FallbackColor; bgClass: string; name: string }> = [
    { color: 'burgundy', bgClass: 'bg-burgundy', name: 'Burgundy' },
    { color: 'orange', bgClass: 'bg-orange', name: 'Orange' },
    { color: 'green', bgClass: 'bg-green', name: 'Green' },
    { color: 'magenta', bgClass: 'bg-magenta', name: 'Magenta' },
    { color: 'gray', bgClass: 'bg-gray', name: 'Gray' }
  ];

  /**
   * Handle thumbnail file drop or selection
   */
  onThumbnailFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadThumbnail(input.files[0]);
    }
  }

  /**
   * Handle thumbnail drag and drop
   */
  onThumbnailDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.uploadThumbnail(event.dataTransfer.files[0]);
    }
  }

  /**
   * Handle gallery file selection
   */
  onGalleryFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.uploadGalleryImage(input.files[0]);
    }
  }

  /**
   * Upload thumbnail image
   */
  private uploadThumbnail(file: File): void {
    if (this.isValidImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image: OfferingImage = {
          id: `thumbnail-${Date.now()}`,
          url: e.target?.result as string,
          file: file
        };
        this.wizardState.setThumbnailImage(image);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Upload gallery image
   */
  private uploadGalleryImage(file: File): void {
    if (this.isValidImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image: OfferingImage = {
          id: `gallery-${Date.now()}`,
          url: e.target?.result as string,
          file: file
        };
        this.wizardState.addGalleryImage(image);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Validate image file type
   */
  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return validTypes.includes(file.type);
  }

  /**
   * Prevent default drag behavior
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  /**
   * Remove thumbnail image
   */
  removeThumbnail(): void {
    this.wizardState.setThumbnailImage(null);
  }

  /**
   * Remove gallery image
   */
  removeGalleryImage(imageId: string): void {
    this.wizardState.removeGalleryImage(imageId);
  }

  /**
   * Select fallback color
   */
  selectFallbackColor(color: FallbackColor): void {
    this.wizardState.setFallbackColor(color);
  }

  /**
   * Check if color is selected
   */
  isColorSelected(color: FallbackColor): boolean {
    return this.wizardState.fallbackColor() === color;
  }

  /**
   * Get current thumbnail
   */
  get thumbnailImage(): OfferingImage | null {
    return this.wizardState.thumbnailImage();
  }

  /**
   * Get gallery images
   */
  get galleryImages(): OfferingImage[] {
    return this.wizardState.galleryImages();
  }

  /**
   * Check if user has thumbnail
   */
  get hasThumbnail(): boolean {
    return this.wizardState.thumbnailImage() !== null;
  }

  /**
   * Trigger file input click
   */
  triggerThumbnailUpload(): void {
    const fileInput = document.getElementById('thumbnail-upload') as HTMLInputElement;
    fileInput?.click();
  }

  /**
   * Trigger gallery file input click
   */
  triggerGalleryUpload(): void {
    const fileInput = document.getElementById('gallery-upload') as HTMLInputElement;
    fileInput?.click();
  }

  /**
   * Get offering name for preview
   */
  getOfferingName(): string {
    const name = this.wizardState.offeringName();
    if (name) return name;
    
    const offeringType = this.wizardState.selectedOfferingType();
    if (offeringType) {
      return `${offeringType.charAt(0).toUpperCase()}${offeringType.slice(1)} Offering`;
    }
    
    return 'Offering Name';
  }

  /**
   * Get offering description for preview
   */
  getOfferingDescription(): string {
    const description = this.wizardState.offeringDescription();
    return description || this.wizardState.tagline() || 'No description provided';
  }

  /**
   * Get key features for preview
   */
  getKeyFeatures(): string[] {
    return this.wizardState.keyFeatures().filter(f => f.trim().length > 0);
  }

  /**
   * Get card header class based on thumbnail or fallback color
   */
  getCardHeaderClass(): string {
    if (this.wizardState.thumbnailImage()) {
      return 'has-image';
    }
    return `card-header-${this.wizardState.fallbackColor()}`;
  }

  /**
   * Get lowest price from tiers
   */
  getLowestPrice(): number {
    const tiers = this.wizardState.tiers();
    if (tiers.length === 0) return 0;
    
    const prices = tiers.map(t => t.priceFrom).filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  }

  /**
   * Get highest price from tiers
   */
  getHighestPrice(): number {
    const tiers = this.wizardState.tiers();
    if (tiers.length === 0) return 0;
    
    const prices = tiers.flatMap(t => [t.priceFrom, t.priceTo]).filter(p => p > 0);
    return prices.length > 0 ? Math.max(...prices) : 0;
  }

  /**
   * Get price unit
   */
  getPriceUnit(): string {
    const tiers = this.wizardState.tiers();
    if (tiers.length === 0) return 'hr';
    
    return tiers[0].priceUnit || 'hr';
  }
}
