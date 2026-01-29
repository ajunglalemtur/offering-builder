import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OfferingState } from '../../services/offering-state';

/**
 * Step 2: Offering Details Form Component
 * Collects detailed information about the offering including:
 * - Name, tagline, key features
 * - Description and tags
 */
@Component({
  selector: 'app-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details {
  wizardState = inject(OfferingState);

  // Form field signals for reactive updates
  offeringName = signal('');
  tagline = signal('High-precision 3-axis CNC machining center for metal fabrication and precision parts manufacturing.');
  
  keyFeatures = signal([
    'Free initial Consultation',
    'Applicable to multiple situations'
  ]);
  
  offeringDescription = signal('High-precision 3-axis CNC machining center for metal fabrication and precision parts manufacturing.');
  tags = signal(['Software', 'Machinery']);

  /**
   * Add a new empty key feature to the list
   */
  addKeyFeature(): void {
    const currentFeatures = this.keyFeatures();
    this.keyFeatures.set([...currentFeatures, '']);
  }

  /**
   * Remove a key feature from the list by index
   */
  removeKeyFeature(featureIndex: number): void {
    const currentFeatures = this.keyFeatures();
    this.keyFeatures.set(
      currentFeatures.filter((_, index) => index !== featureIndex)
    );
  }

  /**
   * Update the text of a specific key feature
   */
  updateKeyFeature(featureIndex: number, newValue: string): void {
    const currentFeatures = this.keyFeatures();
    currentFeatures[featureIndex] = newValue;
    this.keyFeatures.set([...currentFeatures]);
  }

  /**
   * Add a new tag to the list
   */
  addTag(): void {
    const currentTags = this.tags();
    this.tags.set([...currentTags, 'New Tag']);
  }

  /**
   * Remove a tag from the list by index
   */
  removeTag(tagIndex: number): void {
    const currentTags = this.tags();
    this.tags.set(
      currentTags.filter((_, index) => index !== tagIndex)
    );
  }
}
