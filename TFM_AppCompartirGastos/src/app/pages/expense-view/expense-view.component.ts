import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IExpense } from '../../interfaces/iexpense.interface';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-expense-view',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './expense-view.component.html',
  styleUrl: './expense-view.component.css'
})
export class ExpenseViewComponent {
  tipo: string = 'NUEVO';
  btnText: string = 'Añadir gasto';
  groupId: string = '';
  arrUsers: IUser[] = [];
  expenseForm: FormGroup;
  expensesService = inject(ExpensesService);
  userService = inject(UsersService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  users: IUser [] = [];

  constructor() {
    this.expenseForm = new FormGroup({
      id: new FormControl(0, [Validators.required]),
      group_id: new FormControl(null, [Validators.required]),
      description: new FormControl('', [Validators.required]),
      amount: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      payer_user_id: new FormControl('', [Validators.required]),
      active: new FormControl(1)
    }, []);
  }

  // Reutilizar el form para edición
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      // el groupId viene siempre
      if (params.groupId) {
        this.groupId = params.groupId;
        this.expenseForm.get('group_id')?.setValue(this.groupId);
        this.users =  await this.userService.getUsersByGroup(params.groupId);
        
        //Filtrar por usuarios activos
        this.arrUsers = this.users.filter((u) => u.active == true);
      }
      // si viene el expenseId es para editar
      if (params.expenseId) {
        this.tipo = 'EDITAR';
        this.btnText = 'Guardar cambios';
        // Obtener el gasto
        try {
          const expense: IExpense = await this.expensesService.getExpenseById(params.expenseId);
          // Asignar los valores al form
          this.expenseForm.setValue(expense);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  getDataForm() {
    if (this.tipo === 'NUEVO') {
      try {
        const result = this.expensesService.addExpense(this.expenseForm.value);
        this.expenseForm.reset();
        this.router.navigate([`/home/groups/${this.groupId}`]);
      } catch (error) {
        console.error(error);
      }
    } else {
      // Editar
      try {
        const result = this.expensesService.editExpense(this.expenseForm.value);
        this.router.navigate([`/home/groups/${this.groupId}`]);
      } catch (error) {
        console.error(error);
      }
    }

  }

  checkControl(formControlName: string, validator: string): boolean | undefined {
    return (
      this.expenseForm.get(formControlName)?.hasError(validator) &&
      this.expenseForm.get(formControlName)?.touched
    );
  }
  
}
