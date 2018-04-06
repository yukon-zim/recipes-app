import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {RecipeDetailComponent} from './recipe-detail/recipe-detail.component';

@Injectable()
export class SaveFormsGuard implements CanDeactivate<RecipeDetailComponent> {
  canDeactivate(
    component: RecipeDetailComponent
  ): Observable<boolean> | Promise<boolean> | boolean {
    // return component.recipeForm.form.dirty;
    return component.canDeactivate();
  }
}
