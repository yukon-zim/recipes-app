import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeDetailComponent } from './recipe-detail.component';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {RecipeService} from '../recipe.service';
import {ErrorService} from '../error.service';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../testing/activated-route-stub';
import {RECIPES} from '../../testing/fixtures/recipe-fixtures';

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
      declarations: [ RecipeDetailComponent ],
      imports: [FormsModule, RouterTestingModule],
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

  it('should be able to add an ingredient to UI of an existing recipe in the model', async () => {
    const expectedRecipe = RECIPES[0];
    await activatedRoute.setParamMap({id: expectedRecipe.id});
    const initialIngredients = component.recipe.ingredients.slice(0);
    expect(initialIngredients).toEqual(expectedRecipe.ingredients);
    component.addIngredient();
    expect(component.recipe.ingredients.length).toEqual(initialIngredients.length + 1);
    expect(component.isFieldInEditMode('ingredients', initialIngredients.length)).toBe(true);
  });
});
