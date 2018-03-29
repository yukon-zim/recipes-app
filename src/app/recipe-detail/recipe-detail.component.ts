import {Component, OnInit, Input, ViewChild} from '@angular/core';
import { Recipe } from '../recipe';
import { RecipeService } from '../recipe.service';
import { ErrorService } from '../error.service';

import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;
  @ViewChild('recipeForm') recipeForm: NgForm;
  fieldInEditMode: {fieldName: string, fieldIndex: number};
  newRecipeMode: boolean;
  formError: string;


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
    if (this.recipe[fieldName] === '') {
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

  moveIngredientUp(ingredientIndex) {
    const [ingredientToMove] = this.recipe.ingredients.splice(ingredientIndex, 1);
    this.recipe.ingredients.splice(ingredientIndex - 1, 0, ingredientToMove);
    this.recipeForm.form.markAsDirty();
  }

  moveIngredientDown(ingredientIndex) {
    const [ingredientToMove] = this.recipe.ingredients.splice(ingredientIndex, 1);
    this.recipe.ingredients.splice(ingredientIndex + 1, 0, ingredientToMove);
    this.recipeForm.form.markAsDirty();
  }

  moveInstructionUp(instructionIndex) {
    const [instructionToMove] = this.recipe.instructions.splice(instructionIndex, 1);
    this.recipe.instructions.splice(instructionIndex - 1, 0, instructionToMove);
    this.recipeForm.form.markAsDirty();
  }

  moveInstructionDown(instructionIndex) {
    const [instructionToMove] = this.recipe.instructions.splice(instructionIndex, 1);
    this.recipe.instructions.splice(instructionIndex + 1, 0, instructionToMove);
    this.recipeForm.form.markAsDirty();
  }

  deleteIngredient(index) {
    this.recipe.ingredients.splice(index, 1);
    this.recipeForm.form.markAsDirty();
  }

  deleteInstruction(index) {
    this.recipe.instructions.splice(index, 1);
    this.recipeForm.form.markAsDirty();
  }

  goToListView() {
    this.router.navigateByUrl('recipes');
  }

  async getRecipe(): Promise<void> {
    const urlId = +this.route.snapshot.paramMap.get('id');
    if (urlId) {
      try {
        this.recipe = await this.recipeService.getRecipe(urlId);
      } catch (err) {
        this.formError = this.errorService.extractErrorMessage(err, `loading recipe ID ${urlId}`);
      }
      this.newRecipeMode = false;
    } else {
      this.recipe = new Recipe();
      this.newRecipeMode = true;
    }
  }

  async updateRecipe(): Promise<void> {
    const urlId = +this.route.snapshot.paramMap.get('id');
    try {
      this.formError = '';
      this.recipe = await this.recipeService.updateRecipe(urlId, this.recipe);
      this.recipeForm.reset();
      this.getRecipe();
    } catch (err) {
      this.formError = this.errorService.extractErrorMessage(err, `updating recipe ID ${urlId}`);
    }
  }

  async saveNewRecipe(): Promise<void> {
    try {
      this.formError = '';
      this.recipe = await this.recipeService.saveNewRecipe(this.recipe);
      this.goToListView();
    } catch (err) {
      this.formError = this.errorService.extractErrorMessage(err, 'saving new recipe');
    }
  }

  async deleteRecipe(): Promise<void> {
    const urlId = +this.route.snapshot.paramMap.get('id');
    if (confirm(`Are you sure you want to delete this recipe? This action cannot be undone.`)) {
      try {
        this.formError = '';
        await this.recipeService.deleteRecipe(urlId);
        this.goToListView();
      } catch (err) {
        this.formError = this.errorService.extractErrorMessage(err, `deleting recipe ID ${urlId}`);
      }
    }
  }

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private errorService: ErrorService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRecipe();
    this.unfocusField();
  }

}
