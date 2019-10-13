import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Ingredient } from '../../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f') slForm: NgForm;
  editMode = false;
  editItemIndex: number;
  ingredientItem: Ingredient;
  editSubcription: Subscription;
  constructor(private slService: ShoppingListService) {}

  ngOnInit() {
    this.editSubcription = this.slService.editIndex.subscribe(
      (index: number) => {
        this.editItemIndex = index;
        this.editMode = true;
        this.ingredientItem = this.slService.getIngredientItem(index);
        this.slForm.setValue({
          name: this.ingredientItem.name,
          amount: this.ingredientItem.amount
        });
      }
    );
  }

  ngOnDestroy() {
    this.editSubcription.unsubscribe();
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.slService.updateIngredient(this.editItemIndex, newIngredient);
    } else {
      this.slService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onDeleteItem() {
    this.slService.deleteIngredient(this.editItemIndex);
    this.onClearItem();
  }

  onClearItem() {
    this.slForm.reset();
    this.editMode = false;
  }
}
