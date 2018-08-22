import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {RECIPES} from "../../testing/fixtures/recipe-fixtures";
import {RecipeService} from "../recipe.service";
import {ErrorService} from "../error.service";

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let spyRecipeService;
  let spyErrorService;

  beforeEach(async(() => {
    spyErrorService = jasmine.createSpyObj('ErrorService', ['extractErrorMessage']);
    spyRecipeService = jasmine.createSpyObj('RecipeService', {
      'getRecipes': Promise.resolve(RECIPES),
      'importRecipe': Promise.resolve(),
      'searchRecipes': Promise.resolve()
    });
    TestBed.configureTestingModule({
      declarations: [ RecipeListComponent ],
      imports: [RouterTestingModule],
      providers: [
        {provide: RecipeService, useValue: spyRecipeService},
        {provide: ErrorService, useValue: spyErrorService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecipeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance of the component under test', () => {
    expect(component).toBeTruthy();
  });
  it('should load recipes', async () => {

  })
});
