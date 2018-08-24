import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {ErrorService} from '../error.service';
import {orderBy} from 'lodash';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  selectedRecipe: Recipe;
  csvImportEnabled: boolean;
  @ViewChild('csvFile') csvFileInput: ElementRef;
  private searchTerms = new Subject<string>();
  searchResults: Observable<Recipe[]>;
  searchInProgress: boolean;
  currentSearchTerm: string;
  importError: string;
  currentSortByField: string;
  currentSortByOrder: string;

  async getRecipes(): Promise<void> {
    this.recipes = await this.recipeService.getRecipes();
  }

  searchRecipes(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.searchInProgress = false;
    }
    this.searchTerms.next(searchTerm);
    this.currentSearchTerm = searchTerm;
  }

  trackByIndex(index: number, item: string) {
    return index;
  }

  sortByColumnHeader(field: string) {
    if (field === this.currentSortByField) {
      if (this.currentSortByOrder === 'asc') {
        this.currentSortByOrder = 'desc';
      } else {
        this.currentSortByOrder = 'asc';
      }
      this.recipes = orderBy(this.recipes, field, this.currentSortByOrder);
    } else {
      this.currentSortByOrder = 'asc';
      this.recipes = orderBy(this.recipes, field, this.currentSortByOrder);
    }
    this.currentSortByField = field;
  }

  async importRecipe(fileProperty: FileList): Promise<void> {
    this.importError = '';
    const formData = new FormData();
    formData.append('importedRecipes', fileProperty[0]);
    try {
      await this.recipeService.importRecipe(formData);
      await this.getRecipes();
    } catch (err) {
      this.importError = this.errorService.extractErrorMessage(err, `importing recipes`);
    }
    this.cancelImport();
  }

  cancelImport() {
    this.csvFileInput.nativeElement.value = null;
    this.csvImportEnabled = false;
  }

  onSelectFile() {
    this.csvImportEnabled = true;
  }


  constructor(
    private recipeService: RecipeService,
    private errorService: ErrorService,
  ) { }

  ngOnInit() {
    this.recipes = [];
    this.getRecipes();
    this.searchInProgress = false;
    this.csvImportEnabled = false;
    this.searchResults = this.searchTerms.pipe(
      // time to wait after each keystroke before parsing search term
      debounceTime(300),
      // ignore new term if same as previous term
      distinctUntilChanged(),
      // switch to new search observable each time the term changes
      switchMap((term: string) => this.recipeService.searchRecipes(term))
    );
    this.searchResults.subscribe(recipes => {
      this.recipes = recipes;
      if (this.currentSearchTerm.trim()) {
        this.searchInProgress = true;
      } else {
        this.searchInProgress = false;
      }
    });
  }

}
