import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { RecipeListComponent } from './recipe-list.component';
import {RouterTestingModule} from '@angular/router/testing';
import {recipeFixtures} from '../../testing/fixtures/recipe-fixtures';
import {RecipeService} from '../recipe.service';
import {ErrorService} from '../error.service';
import {defer} from 'rxjs/observable/defer';

describe('RecipeListComponent', () => {
  let component: RecipeListComponent;
  let fixture: ComponentFixture<RecipeListComponent>;
  let spyRecipeService;
  let spyErrorService;

  beforeEach(async(() => {
    spyErrorService = jasmine.createSpyObj('ErrorService', ['extractErrorMessage']);
    spyRecipeService = jasmine.createSpyObj('RecipeService', [
      'getRecipes',
      'importRecipe',
      'searchRecipes'
      // 'getRecipes': Promise.resolve(recipeFixtures()),
      // 'importRecipe': Promise.resolve(),
      // 'searchRecipes': Promise.resolve([recipeFixtures()[0]])
    ]);
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
  it('should load recipes on startup', fakeAsync(() => {
    spyRecipeService.getRecipes.and.returnValue(Promise.resolve(recipeFixtures()));
    component.ngOnInit();
    tick(300);
    expect(spyRecipeService.getRecipes).toHaveBeenCalledWith();
    expect(component.recipes).toEqual(recipeFixtures());
  }));
  it('sortByColumnHeader should work correctly', fakeAsync(() => {
    spyRecipeService.getRecipes.and.returnValue(Promise.resolve(recipeFixtures()));
    component.ngOnInit();
    tick(300);
    expect(component.recipes).toEqual(recipeFixtures());
    expect(component.currentSortByField).toEqual(undefined);
    expect(component.currentSortByOrder).toEqual(undefined);
    expect(component.recipes).toEqual(recipeFixtures());
    component.sortByColumnHeader('category');
    expect(component.currentSortByField).toEqual('category');
    expect(component.currentSortByOrder).toEqual('asc');
    expect(component.recipes).toEqual(recipeFixtures());
    component.sortByColumnHeader('category');
    expect(component.currentSortByField).toEqual('category');
    expect(component.currentSortByOrder).toEqual('desc');
    expect(component.recipes).toEqual(recipeFixtures().slice(0).reverse());
    component.sortByColumnHeader('category');
    expect(component.currentSortByField).toEqual('category');
    expect(component.currentSortByOrder).toEqual('asc');
    expect(component.recipes).toEqual(recipeFixtures());
    component.sortByColumnHeader('name');
    expect(component.currentSortByField).toEqual('name');
    expect(component.currentSortByOrder).toEqual('asc');
    expect(component.recipes).toEqual(recipeFixtures());
  }));
  describe('search function', () => {
    it('searchInProgress should update correctly when changing search terms', fakeAsync( () => {
      spyRecipeService.getRecipes.and.returnValue(Promise.resolve(recipeFixtures()));
      spyRecipeService.searchRecipes.and.returnValue(defer(() => {
        return Promise.resolve([recipeFixtures()[0]]);
      }));
      component.ngOnInit();
      tick(301);
      fixture.detectChanges();
      let compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain(`My ${component.recipes.length} Recipes`);
      expect(component.searchInProgress).toBe(false);
      component.searchRecipes('test');
      tick(301);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain(`Search results:  ${component.recipes.length} recipe(s)`);
      expect(component.searchInProgress).toBe(true);
      component.searchRecipes('    ');
      tick(301);
      fixture.detectChanges();
      compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector('h2').textContent).toContain(`My ${component.recipes.length} Recipes`);
      expect(component.searchInProgress).toBe(false);
    }));
    it('should update component.recipes based on data returned from service', fakeAsync(() => {
      spyRecipeService.getRecipes.and.returnValue(Promise.resolve(recipeFixtures()));
      spyRecipeService.searchRecipes.and.returnValue(defer(() => {
        return Promise.resolve([recipeFixtures()[0]]);
      }));
      const searchTerm = 'test';
      component.ngOnInit();
      tick(301);
      const initialRecipes = component.recipes;
      component.searchRecipes(searchTerm);
      tick(301);
      expect(spyRecipeService.searchRecipes).toHaveBeenCalledWith(searchTerm);
      expect(component.currentSearchTerm).toEqual(searchTerm);
      fixture.detectChanges();
      expect(component.recipes).not.toEqual(initialRecipes);
    }));
  });
  describe('csv import function', () => {
    it('success case: csvImport should be called without error and csvImportEnabled should be set correctly', async () => {
      const mockFileListWrapper = new DataTransfer();
      mockFileListWrapper.items.add(new File(['importedRecipes'], 'mock-import-file.csv'));
      spyRecipeService.importRecipe.and.returnValue(Promise.resolve());
      expect(component.csvImportEnabled).toEqual(false);
      component.onSelectFile();
      expect(component.csvImportEnabled).toEqual(true);
      await component.importRecipe(mockFileListWrapper.files);
      expect(spyRecipeService.importRecipe).toHaveBeenCalled();
      expect(spyRecipeService.getRecipes).toHaveBeenCalledTimes(2);
      expect(component.importError).toEqual('');
      expect(component.csvImportEnabled).toEqual(false);
    });
    it('failure case: should throw import error and csvImportEnabled should be set correctly', async () => {
      const mockFileListWrapper = new DataTransfer();
      const mockError = 'mock import error';
      mockFileListWrapper.items.add(new File(['importedRecipes'], 'mock-import-file.csv'));
      spyRecipeService.importRecipe.and.throwError(mockError);
      spyErrorService.extractErrorMessage.and.returnValue(mockError);
      expect(component.csvImportEnabled).toEqual(false);
      component.onSelectFile();
      expect(component.csvImportEnabled).toEqual(true);
      await component.importRecipe(mockFileListWrapper.files);
      expect(spyRecipeService.importRecipe).toHaveBeenCalled();
      expect(spyRecipeService.getRecipes).toHaveBeenCalledTimes(1);
      expect(component.importError).toEqual(mockError);
      expect(component.csvImportEnabled).toEqual(false);
    });
  });
});
