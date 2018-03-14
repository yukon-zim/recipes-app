import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { RECIPES } from './mock-recipes';

@Injectable()
export class RecipeService {
  getRecipes(): Recipe[] {
    return RECIPES;
  }

  async getRecipe(id: number): Promise<Recipe> {
    return RECIPES.find(recipe => recipe.id === id);
  }

  constructor() { }

}
