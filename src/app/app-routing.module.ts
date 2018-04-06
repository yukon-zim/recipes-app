import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { SaveFormsGuard } from './save-forms.guard';

const routes: Routes = [
  { path: 'recipes', component: RecipeListComponent },
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  { path: 'detail/:id', component: RecipeDetailComponent, canDeactivate: [SaveFormsGuard] },
  { path: 'detail/new', component: RecipeDetailComponent, canDeactivate: [SaveFormsGuard] }
];

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [ RouterModule.forRoot(routes) ],
  providers: [ SaveFormsGuard ]
})
export class AppRoutingModule { }
