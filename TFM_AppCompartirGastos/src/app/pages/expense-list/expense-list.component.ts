import { Component, inject } from '@angular/core';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router } from '@angular/router';
import dayjs from 'dayjs';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent {
  arrExpenses: IExpense[] = [];
  groupId: string = '';
  expenseService = inject(ExpensesService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        try {
          this.arrExpenses = await this.expenseService.getExpensesByGroup(params.groupId);
          console.log(this.arrExpenses);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  editExpense(expenseId: number) {
    console.log(expenseId);
    this.router.navigate([`/home/expenses/${this.groupId}/edit/${expenseId}`]);
  }

  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

}
