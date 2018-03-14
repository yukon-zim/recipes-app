import { Component, OnInit, Input } from '@angular/core';
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
  fieldInEditMode: string;

  trackByIndex(index: number, item: string) {
    return index;
  }

  editField(fieldName, index) {
    this.fieldInEditMode = {fieldName, fieldIndex: index};
  }

  isFieldInEditMode(fieldName, index) {
    return this.fieldInEditMode.fieldName === fieldName && this.fieldInEditMode.fieldIndex === index;
  }

  unfocusField(fieldName) {
    this.fieldInEditMode = {fieldName: null, fieldIndex: null};
  }




  async getRecipe(): void {
    const urlId = +this.route.snapshot.paramMap.get('id');
    this.recipe = await this.recipeService.getRecipe(urlId);
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
