import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {RecipeService} from '../recipe.service';
import {ErrorService} from '../error.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {recipeFixtures} from '../../testing/fixtures/recipe-fixtures';
import {Recipe} from '../recipe';
import {RecipeListComponent} from '../recipe-list/recipe-list.component';

describe('RecipeDetailComponent', () => {
  let component: RecipeDetailComponent;
  let fixture: ComponentFixture<RecipeDetailComponent>;
  let activatedRoute: ActivatedRouteStub;
  let spyRecipeService;
  let spyErrorService;
  let spyRouter;

  beforeEach(async(() => {
    spyRecipeService = jasmine.createSpyObj('RecipeService', {
      'getRecipe': Promise.resolve(recipeFixtures()[0]),
      'updateRecipe': Promise.resolve(),
      'saveNewRecipe': Promise.resolve(),
      'deleteRecipe': Promise.resolve()
    });
    spyErrorService = jasmine.createSpyObj('ErrorService', ['extractErrorMessage']);
    spyRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);
    activatedRoute = new ActivatedRouteStub();
    activatedRoute.snapshot.paramMap.get = jasmine.createSpy('get').and.returnValue(1);
    TestBed.configureTestingModule({
      declarations: [RecipeDetailComponent, RecipeListComponent],
      imports: [FormsModule, RouterTestingModule],
      providers: [
        {provide: Router, useValue: spyRouter},
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

  it('should create an instance of the component under test', () => {
    expect(component).toBeTruthy();
  });
  it('trackByIndex should work correctly', () => {
    expect(component.trackByIndex(1, 'dummyValue')).toEqual(1);
  });
  describe('ingredient tests', () => {
    it('should be able to add an ingredient to UI of an existing recipe in the model', async () => {
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialIngredients = component.recipe.ingredients.slice(0);
      expect(initialIngredients).toEqual(expectedRecipe.ingredients);
      component.addIngredient();
      expect(component.recipe.ingredients.length).toEqual(initialIngredients.length + 1);
      expect(component.isFieldInEditMode('ingredients', initialIngredients.length)).toBe(true);
    });
    it('should move ingredients up/down the list', async () => {
      const expectedRecipe = recipeFixtures()[0];
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
      const expectedRecipe = recipeFixtures()[0];
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
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      const initialInstructions = component.recipe.instructions.slice(0);
      expect(initialInstructions).toEqual(expectedRecipe.instructions);
      component.addInstruction();
      expect(component.recipe.instructions.length).toEqual(initialInstructions.length + 1);
      expect(component.isFieldInEditMode('instructions', initialInstructions.length)).toBe(true);
    });
    it('should move instructions up/down the list', async () => {
      const expectedRecipe = recipeFixtures()[0];
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
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(1);
      const initialInstructions = component.recipe.instructions.slice(0);
      expect(initialInstructions).toEqual(expectedRecipe.instructions);
      expect(component.recipeForm.form.dirty).toEqual(false);
      component.deleteInstruction(0);
      expect(component.recipe.instructions.length).toEqual(initialInstructions.length - 1);
      expect(component.recipeForm.form.dirty).toEqual(true);
    });
  });
  describe('canDeactivate', () => {
    it('should not display confirm window if form is pristine', () => {
      const spyConfirm = spyOn(window, 'confirm').and.returnValue(false);
      expect(component.recipeForm.form.pristine).toEqual(true);
      expect(component.canDeactivate()).toEqual(true);
      expect(spyConfirm).not.toHaveBeenCalled();
    });
    it('should display correctly functioning confirm window if form is dirty', () => {
      const spyConfirm = spyOn(window, 'confirm').and.returnValue(false);
      component.recipeForm.form.markAsDirty();
      expect(component.canDeactivate()).toEqual(false);
      expect(spyConfirm).toHaveBeenCalledTimes(1);
      spyConfirm.and.returnValue(true);
      expect(component.canDeactivate()).toEqual(true);
      expect(spyConfirm).toHaveBeenCalledTimes(2);
    });
  });
  describe('getRecipe', () => {
    it('success case: should load a recipe on startup', async () => {
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
      expect(component.recipe).toBeTruthy();
      expect(component.newRecipeMode).toEqual(false);
      for (const key in component.recipe) {
        if (component.recipe.hasOwnProperty(key)) {
          expect(component.recipe[key]).toEqual(expectedRecipe[key]);
        }
      }
    });
    it('failure case: should throw error', async () => {
      const expectedRecipe = recipeFixtures()[0];
      const mockError = 'mock getRecipe error';
      spyRecipeService.getRecipe.and.throwError(mockError);
      spyErrorService.extractErrorMessage.and.returnValue(mockError);
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
      expect(component.newRecipeMode).toEqual(false);
      expect(spyErrorService.extractErrorMessage).toHaveBeenCalledWith(new Error(mockError), 'loading recipe ID 1');
      expect(component.formError).toEqual(mockError);
    });
  });
  describe('saveNewRecipe', () => {
    it('success case: should successfully save a new recipe', async () => {
      const blankRecipe = new Recipe();
      await activatedRoute.setParamMap({id: null});
      expect(component.recipe).toEqual(blankRecipe);
      expect(component.newRecipeMode).toEqual(true);
      spyRecipeService.saveNewRecipe.and.returnValue(Promise.resolve(blankRecipe));
      await component.saveNewRecipe();
      expect(spyRecipeService.saveNewRecipe).toHaveBeenCalledWith(blankRecipe);
      expect(spyRouter.navigateByUrl).toHaveBeenCalledWith('recipes');
      expect(component.formError).toEqual('');
      expect(component.recipe).toEqual(blankRecipe);
    });
    it('failure case: should throw error', async () => {
      const blankRecipe = new Recipe();
      const mockError = 'mock saveNewRecipe error';
      await activatedRoute.setParamMap({id: null});
      expect(component.recipe).toEqual(blankRecipe);
      expect(component.newRecipeMode).toEqual(true);
      spyRecipeService.saveNewRecipe.and.throwError(mockError);
      spyErrorService.extractErrorMessage.and.returnValue(mockError);
      await component.saveNewRecipe();
      expect(spyRecipeService.saveNewRecipe).toHaveBeenCalledWith(blankRecipe);
      expect(component.recipe).toEqual(blankRecipe);
      expect(spyRouter.navigateByUrl).not.toHaveBeenCalled();
      expect(spyErrorService.extractErrorMessage).toHaveBeenCalledWith(new Error(mockError), 'saving new recipe');
      expect(component.formError).toEqual(mockError);
    });
  });
  describe('updateRecipe', () => {
    it('success case: should successfully update a recipe', async () => {
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(component.recipe).toEqual(expectedRecipe);
      expect(component.newRecipeMode).toEqual(false);
      component.recipe.category = 'test update';
      const updatedRecipe = component.recipe;
      spyRecipeService.updateRecipe.and.returnValue(Promise.resolve(updatedRecipe));
      await component.updateRecipe();
      expect(spyRecipeService.updateRecipe).toHaveBeenCalled();
      expect(component.recipe).toEqual(updatedRecipe);
      expect(component.newRecipeMode).toEqual(false);
      expect(spyRecipeService.getRecipe).toHaveBeenCalledTimes(2);
      expect(component.formError).toEqual('');
    });
    it('failure case: should throw error', async () => {
      const expectedRecipe = recipeFixtures()[0];
      const mockError = 'mock updateRecipe error';
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(component.recipe).toEqual(expectedRecipe);
      expect(component.newRecipeMode).toEqual(false);
      component.recipe.category = 'test update';
      const updatedRecipe = component.recipe;
      spyRecipeService.updateRecipe.and.throwError(mockError);
      spyErrorService.extractErrorMessage.and.returnValue(mockError);
      await component.updateRecipe();
      expect(spyRecipeService.updateRecipe).toHaveBeenCalled();
      expect(component.recipe).toEqual(updatedRecipe);
      expect(component.newRecipeMode).toEqual(false);
      expect(spyRecipeService.getRecipe).toHaveBeenCalledTimes(1);
      expect(spyErrorService.extractErrorMessage).toHaveBeenCalledWith(new Error(mockError), 'updating recipe ID 1');
      expect(component.formError).toEqual(mockError);
    });
  });
  describe('deleteRecipe', () => {
    it('success case: should successfully delete a recipe', async () => {
      const expectedRecipe = recipeFixtures()[0];
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
      expect(component.newRecipeMode).toEqual(false);
      expect(component.recipe).toEqual(expectedRecipe);
      spyRecipeService.deleteRecipe.and.returnValue(Promise.resolve());
      // setup spy for confirm window
      spyOn(window, 'confirm').and.returnValue(true);
      await component.deleteRecipe();
      expect(spyRecipeService.deleteRecipe).toHaveBeenCalledWith(1);
      expect(spyRouter.navigateByUrl).toHaveBeenCalledWith('recipes');
      expect(component.formError).toEqual('');
    });
    it('failure case: should throw an error', async () => {
      const expectedRecipe = recipeFixtures()[0];
      const mockError = 'mock deleteRecipe error';
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
      expect(component.newRecipeMode).toEqual(false);
      expect(component.recipe).toEqual(expectedRecipe);
      // spies for error handling
      spyRecipeService.deleteRecipe.and.throwError(mockError);
      spyErrorService.extractErrorMessage.and.returnValue(mockError);
      // setup spy for confirm window
      spyOn(window, 'confirm').and.returnValue(true);
      await component.deleteRecipe();
      expect(spyRecipeService.deleteRecipe).toHaveBeenCalledWith(1);
      expect(spyErrorService.extractErrorMessage).toHaveBeenCalledWith(new Error(mockError), 'deleting recipe ID 1');
      expect(spyRouter.navigateByUrl).not.toHaveBeenCalled();
      expect(component.formError).toEqual(mockError);
    });
    it('should not delete recipe if confirm alert is rejected', async () => {
      const expectedRecipe = recipeFixtures()[0];
      component.formError = 'placeholder';
      await activatedRoute.setParamMap({id: expectedRecipe.id});
      expect(spyRecipeService.getRecipe).toHaveBeenCalledWith(expectedRecipe.id);
      expect(component.newRecipeMode).toEqual(false);
      expect(component.recipe).toEqual(expectedRecipe);
      spyRecipeService.deleteRecipe.and.returnValue(Promise.resolve());
      // setup spy for confirm window
      spyOn(window, 'confirm').and.returnValue(false);
      await component.deleteRecipe();
      expect(spyRecipeService.deleteRecipe).not.toHaveBeenCalled();
      expect(spyRouter.navigateByUrl).not.toHaveBeenCalled();
      expect(component.formError).toEqual('placeholder');
    });
  });
});
