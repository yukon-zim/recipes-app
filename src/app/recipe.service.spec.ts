import { TestBed, inject, getTestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RecipeService } from './recipe.service';
import {RECIPES} from '../testing/fixtures/recipe-fixtures';


fdescribe('RecipeService', () => {
  let service;
  let httpController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecipeService],
      imports: [HttpClientTestingModule]
    });
    const testBed = getTestBed();
    service = testBed.get(RecipeService);
    httpController = testBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRecipes()', () => {
    it('should return the expected data', async () => {
      const recipesPromise = service.getRecipes();
      const testRequest = httpController.expectOne('http://localhost:1337/recipes', 'call to getRecipes URL');
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(expectedResponse);
      const recipes = await recipesPromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.getRecipes();
      const testRequest = httpController.expectOne('http://localhost:1337/recipes', 'call to getRecipes URL');
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
  describe('searchRecipes()', () => {
    const testSearchTerm = 'test';
    it('should return the expected data',  done => {
      const recipesObservable = service.searchRecipes(testSearchTerm);
      const expectedResponse = 'mock response';
      recipesObservable.subscribe(recipes => {
        expect(recipes).toEqual(expectedResponse);
        done();
      });
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes?searchTerm=${testSearchTerm}`,
        'call to searchRecipes URL');
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(expectedResponse);
    });
    it('should throw an error if the server responds with an error', done => {
      const recipesObservable = service.searchRecipes(testSearchTerm);
      const mockError = new ErrorEvent('mock network failure');
      recipesObservable.subscribe(undefined, err => {
        expect(err.error).toEqual(mockError);
        done();
      });
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes?searchTerm=${testSearchTerm}`,
        'call to searchRecipes URL');
      testRequest.error(mockError);
    });
  });
  describe('getRecipe()', () => {
    const testRecipeId = 1;
    it('should return the expected data', async () => {
      const recipePromise = service.getRecipe(testRecipeId);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to getRecipe for recipeID ${testRecipeId}`);
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('GET');
      testRequest.flush(expectedResponse);
      const recipes = await recipePromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.getRecipe(testRecipeId);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to getRecipe for recipeID ${testRecipeId}`);
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
  describe('updateRecipe()', () => {
    const testRecipeId = 1;
    const updatedTestRecipe = {
      id: 1,
      name: 'testing updateRecipe()',
      category: 'test',
      ingredients: [
        'test',
      ],
      numberOfServings: 'test',
      instructions: [
        'test',
      ],
      dateCreated: new Date('1/28/2001'),
      dateModified: new Date(),
      notes: 'test'
    };
    it('should return the expected data', async () => {
      const recipePromise = service.updateRecipe(testRecipeId, updatedTestRecipe);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to updateRecipe for recipeID ${testRecipeId}`);
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('PUT');
      expect(testRequest.request.body).toEqual(updatedTestRecipe);
      testRequest.flush(expectedResponse);
      const recipes = await recipePromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.updateRecipe(testRecipeId, updatedTestRecipe);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to updateRecipe for recipeID ${testRecipeId}`);
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
  describe('saveNewRecipe()', () => {
    const testRecipe = {
      id: 5000,
      name: 'testing updateRecipe()',
      category: 'test',
      ingredients: [
        'test',
      ],
      numberOfServings: 'test',
      instructions: [
        'test',
      ],
      dateCreated: new Date('1/28/2001'),
      dateModified: new Date(),
      notes: 'test'
    };

    it('should return the expected data', async () => {
      const recipePromise = service.saveNewRecipe(testRecipe);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes`,
        `call to saveNewRecipe`);
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('POST');
      expect(testRequest.request.body).toEqual(testRecipe);
      testRequest.flush(expectedResponse);
      const recipes = await recipePromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.saveNewRecipe(testRecipe);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes`,
        `call to saveNewRecipe`);
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
  describe('deleteRecipe()', () => {
    const testRecipeId = 1;
    it('should return the expected data', async () => {
      const recipePromise = service.deleteRecipe(testRecipeId);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to deleteRecipe for recipe ID ${testRecipeId}`);
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('DELETE');
      testRequest.flush(expectedResponse);
      const recipes = await recipePromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.deleteRecipe(testRecipeId);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/${testRecipeId}`,
        `call to deleteRecipe for recipe ID ${testRecipeId}`);
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
  describe('importRecipe()', () => {
    const mockRecipeFormData = '';
    it('should return the expected data', async () => {
      const recipePromise = service.importRecipe(mockRecipeFormData);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/import`,
        `call to importRecipe`);
      const expectedResponse = 'mock response';
      expect(testRequest.request.method).toEqual('POST');
      expect(testRequest.request.body).toEqual(mockRecipeFormData);
      testRequest.flush(expectedResponse);
      const recipes = await recipePromise;
      expect(recipes).toEqual(expectedResponse);
    });
    it('should throw an error if the server responds with an error', async () => {
      const recipesPromise = service.importRecipe(mockRecipeFormData);
      const testRequest = httpController.expectOne(
        `http://localhost:1337/recipes/import`,
        `call to importRecipe`);
      const mockError = new ErrorEvent('mock network failure');
      testRequest.error(mockError);
      try {
        await recipesPromise;
      } catch (err) {
        expect(err.error).toEqual(mockError);
      }
    });
  });
});
