import {Component, OnInit, Input, ViewChild, AfterViewInit} from '@angular/core';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';

import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  fieldInEditMode: object;
  newRecipeMode: boolean;

  trackByIndex(index: number, item: string) {
    return index;
  }

  editField(fieldName, index) {
    this.fieldInEditMode = {fieldName, fieldIndex: index};
  }

  /**
   * checks if specific field has focus in UI; always true if adding new recipe
   * @param fieldName: string
   * @param index: number (used for array fields)
   * @returns {boolean}
   */
  isFieldInEditMode(fieldName: string, index: number) {
    if (this.newRecipeMode) {
      return true;
    }
    return this.fieldInEditMode.fieldName === fieldName && this.fieldInEditMode.fieldIndex === index;
  }

  unfocusField() {
    this.fieldInEditMode = {fieldName: null, fieldIndex: null};
  }

  addIngredient() {
    this.recipe.ingredients.push('');
    this.editField('ingredients', this.recipe.ingredients.length - 1);
  }

  addInstruction() {
    this.recipe.instructions.push('');
    this.editField('instructions', this.recipe.instructions.length - 1);
  }

  deleteIngredient(index) {
    this.recipe.ingredients.splice(index, 1);
  }

  deleteInstruction(index) {
    this.recipe.instructions.splice(index, 1);
  }

  async getRecipe(): void {
    const urlId = +this.route.snapshot.paramMap.get('id');
    if (urlId) {
      this.recipe = await this.recipeService.getRecipe(urlId);
      this.newRecipeMode = false;
    } else {
      this.recipe = new Recipe();
      this.newRecipeMode = true;
    }
  }

  async updateRecipe(): void {
    const urlId = +this.route.snapshot.paramMap.get('id');
    this.recipe = await this.recipeService.updateRecipe(urlId, this.recipe);
  }

  async saveNewRecipe(): void {
    this.recipe = await this.recipeService.saveNewRecipe();
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getRecipe();
    this.unfocusField();
  }

}
