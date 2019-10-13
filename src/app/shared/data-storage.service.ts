import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  recipesURL = 'https://recipes-demo-7fd05.firebaseio.com/recipes.json';
  constructor(
    private http: HttpClient,
    private recipeService: RecipeService,
    private authService: AuthService
  ) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(this.recipesURL, recipes).subscribe(response => {
      console.log(response);
    });
  }

  fetchRecipes() {
    /**
     * - Wait for the first obserable, for the user observable to complete which will happen after took the lastest user
     * - It gives that user
     * - exhauMap pass a function, in there we get data from the previous observale and return new observable.
     * - New observable will replace privious observable
     */
    return this.http.get<Recipe[]>(this.recipesURL).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
