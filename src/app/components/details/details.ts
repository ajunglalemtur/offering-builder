import { Component, inject, signal, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
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
export class Details implements AfterViewInit {
  wizardState = inject(OfferingState);
  
  editingTagIndex: number | null = null;
  
  @ViewChildren('tagInput') tagInputs!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    this.tagInputs.changes.subscribe(() => {
      if (this.tagInputs.length > 0) {
        setTimeout(() => {
          this.tagInputs.first.nativeElement.focus();
          this.tagInputs.first.nativeElement.select();
        });
      }
    });
  }

  /**
   * Add a new empty key feature to the list
   */
  addKeyFeature(): void {
    const currentFeatures = this.wizardState.keyFeatures();
    this.wizardState.keyFeatures.set([...currentFeatures, '']);
  }

  /**
   * Remove a key feature from the list by index
   */
  removeKeyFeature(featureIndex: number): void {
    const currentFeatures = this.wizardState.keyFeatures();
    this.wizardState.keyFeatures.set(
      currentFeatures.filter((_, index) => index !== featureIndex)
    );
  }

  /**
   * Update the text of a specific key feature
   */
  updateKeyFeature(featureIndex: number, newValue: string): void {
    const currentFeatures = this.wizardState.keyFeatures();
    currentFeatures[featureIndex] = newValue;
    this.wizardState.keyFeatures.set([...currentFeatures]);
  }

  /**
   * Add a new tag to the list
   */
  addTag(): void {
    const currentTags = this.wizardState.tags();
    const newIndex = currentTags.length;
    this.wizardState.tags.set([...currentTags, 'New Tag']);
    this.editingTagIndex = newIndex;
  }

  /**
   * Remove a tag from the list by index
   */
  removeTag(tagIndex: number): void {
    const currentTags = this.wizardState.tags();
    this.wizardState.tags.set(
      currentTags.filter((_, index) => index !== tagIndex)
    );
  }

  /**
   * Start editing a tag
   */
  startEditingTag(tagIndex: number): void {
    this.editingTagIndex = tagIndex;
  }

  /**
   * Stop editing a tag
   */
  stopEditingTag(): void {
    this.editingTagIndex = null;
  }

  /**
   * Update the text of a specific tag
   */
  updateTag(tagIndex: number, newValue: string): void {
    const currentTags = this.wizardState.tags();
    currentTags[tagIndex] = newValue;
    this.wizardState.tags.set([...currentTags]);
  }
}
