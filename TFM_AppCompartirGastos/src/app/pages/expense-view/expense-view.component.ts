import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IExpense } from '../../interfaces/iexpense.interface';

@Component({
  selector: 'app-expense-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './expense-view.component.html',
  styleUrl: './expense-view.component.css'
})
export class ExpenseViewComponent {
  tipo: string = 'NUEVO';
  expenseForm: FormGroup;
  expensesService = inject(ExpensesService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.expenseForm = new FormGroup({
      id: new FormControl(null, [Validators.required]),
      group_id: new FormControl(null, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      payer_user_id: new FormControl(null, [Validators.required]),
      active: new FormControl(1)
    });
  }

  // Reutilizar el form para edición
  ngOnInit() {
    console.log(this.activatedRoute.params);
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.expenseId) {
        this.tipo = 'EDITAR';
        // Obtener el gasto
        try {
          const expense: IExpense = await this.expensesService.getExpenseById(params.expenseId);
          // Asignar los valores al form
          console.log(expense);
          this.expenseForm.setValue(expense);
        } catch (error) {
          console.error(error);
        }


      }
    });
  }

  getDataForm() {
    console.log(this.expenseForm.value); 


  }

  checkControl(formControlName: string,validador: string): boolean | undefined {
    return (
      this.expenseForm.get(formControlName)?.hasError(validador) &&
      this.expenseForm.get(formControlName)?.touched
    );
  }
}
