import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  csvImportEnabled: boolean;
  @ViewChild('csvFile') csvFileInput: ElementRef;

  async getRecipes(): Promise<void> {
    this.recipes = await this.recipeService.getRecipes();
  }

  onSelect(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  async importRecipe(fileProperty: FileList): Promise<void> {
    console.log(this.csvFileInput.nativeElement.value);
    const formData = new FormData();
    formData.append('importedRecipes', fileProperty[0]);
    await this.recipeService.importRecipe(formData);
    await this.getRecipes();
  }

  cancelImport() {
    this.csvFileInput.nativeElement.value = null;
    this.csvImportEnabled = false;
  }

  onSelectFile(fileProperty: FileList) {
    console.log(fileProperty);
    this.csvImportEnabled = true;
  }


  constructor(
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.getRecipes();
  }

}
