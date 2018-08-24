import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {RecipeService} from '../recipe.service';
import {ErrorService} from '../error.service';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {RECIPES} from '../../testing/fixtures/recipe-fixtures';
import {Recipe} from "../recipe";
import {RecipeListComponent} from "../recipe-list/recipe-list.component";

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let activatedRoute: ActivatedRouteStub;
  let spyRecipeService;
  let spyErrorService;

  beforeEach(async(() => {
    spyRecipeService = jasmine.createSpyObj('RecipeService', {
      'getRecipe': Promise.resolve(RECIPES[0]),
      'updateRecipe': Promise.resolve(),
      'saveNewRecipe': Promise.resolve(),
      'deleteRecipe': Promise.resolve()
    });
    spyErrorService = jasmine.createSpyObj('ErrorService', ['extractErrorMessage']);
    activatedRoute = new ActivatedRouteStub();
    TestBed.configureTestingModule({
      declarations: [ RecipeDetailComponent, RecipeListComponent],
      imports: [FormsModule, RouterTestingModule.withRoutes([
        { path: 'recipes', component: RecipeListComponent }
      ])],
      providers: [
        {provide: RecipeService, useValue: spyRecipeService},
        {provide: ErrorService, useValue: spyErrorService},
        {provide: ActivatedRoute, useValue: activatedRoute}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load a recipe on startup', async () => {
    const expectedRecipe = RECIPES[0];
    await activatedRoute.setParamMap({id: expectedRecipe.id});
    expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
    expect(component.recipe).toBeTruthy();
    for (const key in component.recipe) {
      if (component.recipe.hasOwnProperty(key)) {
        expect(component.recipe[key]).toEqual(expectedRecipe[key]);
      }
    }
  });
  describe('ingredient tests', () => {
    it('should be able to add an ingredient to UI of an existing recipe in the model', async () => {
      const expectedRecipe = RECIPES[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialIngredients = component.recipe.ingredients.slice(0);
      expect(initialIngredients).toEqual(expectedRecipe.ingredients);
      component.addIngredient();
      expect(component.recipe.ingredients.length).toEqual(initialIngredients.length + 1);
      expect(component.isFieldInEditMode('ingredients', initialIngredients.length)).toBe(true);
    });
    it('should move ingredients up/down the list', async () => {
      const expectedRecipe = RECIPES[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialIngredients = component.recipe.ingredients.slice(0);
      const ingredient1 = initialIngredients[0].slice(0);
      const ingredient2 = initialIngredients[1].slice(0);
      const ingredient3 = initialIngredients[2].slice(0);
      expect(initialIngredients).toEqual(expectedRecipe.ingredients);
      expect(component.recipeForm.form.dirty).toEqual(false);
      component.moveIngredientUp(1);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.ingredients[0]).toEqual(ingredient2);
      expect(component.recipe.ingredients[1]).toEqual(ingredient1);
      component.moveIngredientUp(2);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.ingredients[1]).toEqual(ingredient3);
      component.moveIngredientDown(0);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.ingredients[0]).toEqual(ingredient3);
      component.moveIngredientDown(0);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.ingredients[0]).toEqual(ingredient2);
    });
    it('should successfully delete an ingredient', async () => {
      const expectedRecipe = RECIPES[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialIngredients = component.recipe.ingredients.slice(0);
      expect(initialIngredients).toEqual(expectedRecipe.ingredients);
      expect(component.recipeForm.form.dirty).toEqual(false);
      component.deleteIngredient(0);
      expect(component.recipe.ingredients.length).toEqual(initialIngredients.length - 1);
      expect(component.recipeForm.form.dirty).toEqual(true);
    });
  });
  describe('instruction tests', () => {
    it('should be able to add an instruction to UI of an existing recipe in the model', async () => {
      const expectedRecipe = RECIPES[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialInstructions = component.recipe.instructions.slice(0);
      expect(initialInstructions).toEqual(expectedRecipe.instructions);
      component.addInstruction();
      expect(component.recipe.instructions.length).toEqual(initialInstructions.length + 1);
      expect(component.isFieldInEditMode('instructions', initialInstructions.length)).toBe(true);
    });
    it('should move instructions up/down the list', async () => {
      const expectedRecipe = RECIPES[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialInstructions = component.recipe.instructions.slice(0);
      const instruction1 = initialInstructions[0].slice(0);
      const instruction2 = initialInstructions[1].slice(0);
      const instruction3 = initialInstructions[2].slice(0);
      expect(initialInstructions).toEqual(expectedRecipe.instructions);
      expect(component.recipeForm.form.dirty).toEqual(false);
      component.moveInstructionUp(1);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.instructions[0]).toEqual(instruction2);
      expect(component.recipe.instructions[1]).toEqual(instruction1);
      component.moveInstructionUp(2);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.instructions[1]).toEqual(instruction3);
      component.moveInstructionDown(0);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.instructions[0]).toEqual(instruction3);
      component.moveInstructionDown(0);
      expect(component.recipeForm.form.dirty).toEqual(true);
      expect(component.recipe.instructions[0]).toEqual(instruction2);
    });
    it('should successfully delete an instruction', async () => {
      await component.getRecipe(1);
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(1);
      const expectedRecipe = RECIPES[0];
      const initialInstructions = component.recipe.instructions.slice(0);
      expect(initialInstructions).toEqual(expectedRecipe.instructions);
      expect(component.recipeForm.form.dirty).toEqual(false);
      component.deleteInstruction(0);
      expect(component.recipe.instructions.length).toEqual(initialInstructions.length - 1);
      expect(component.recipeForm.form.dirty).toEqual(true);
    });
  });
  describe('saveNewRecipe', () => {
    it('should successfully save a new recipe', async () => {
      const blankRecipe = new Recipe();
      await component.getRecipe(null);
      expect(component.recipe).toEqual(blankRecipe);
      expect(component.newRecipeMode).toEqual(true);
      await component.saveNewRecipe();
      expect(spyRecipeService.saveNewRecipe).toHaveBeenCalledWith(blankRecipe);
    });
  });
});
