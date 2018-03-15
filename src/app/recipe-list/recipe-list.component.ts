import { Component, OnInit } from '@angular/core';
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

  async getRecipes(): void {
    this.recipes = await this.recipeService.getRecipes();
  }

  onSelect(recipe: Recipe): void {
    this.selectedRecipe = recipe;
  }

  constructor(
    private recipeService: RecipeService
  ) { }

  ngOnInit() {
    this.getRecipes();
  }

}
