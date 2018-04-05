import { Injectable } from '@angular/core';
import { Recipe } from './recipe';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class RecipeService {
  private recipeUrl = 'http://localhost:1337/recipes';

  async getRecipes(): Promise<Recipe[]> {
    return await this.http.get<Recipe[]>(this.recipeUrl).toPromise();
  }

  async getRecipe(id: number): Promise<Recipe> {
    return await this.http.get<Recipe>(`${this.recipeUrl}/${id}`).toPromise();
  }

  async updateRecipe(id: number, recipe: Recipe): Promise<Recipe> {
    return await this.http.put<Recipe>(`${this.recipeUrl}/${id}`, recipe).toPromise();
  }

  async saveNewRecipe(recipe: Recipe): Promise<Recipe> {
    return await this.http.post<Recipe>(this.recipeUrl, recipe).toPromise();
  }

  async deleteRecipe(id: number): Promise<object> {
    return await this.http.delete<object>(`${this.recipeUrl}/${id}`).toPromise();
  }

  async importRecipe(formData: FormData): Promise<object> {
    return await this.http.post<object>(`${this.recipeUrl}/import`, formData).toPromise();
  }

  constructor(
    private http: HttpClient
  ) { }

}
