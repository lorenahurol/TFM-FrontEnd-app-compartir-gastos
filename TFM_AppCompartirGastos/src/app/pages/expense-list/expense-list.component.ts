import { Component, inject } from '@angular/core';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css',
})
export class ExpenseListComponent {
  arrExpenses: IExpense[] = [];
  arrUsers: IUser[] = [];
  groupId: string = '';
  expenseService = inject(ExpensesService);
  userService = inject(UsersService);
  groupService = inject(GroupsService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  expenseId: number = -1;
  isAdmin: boolean = false;

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        try {
          this.getIsAdmin();
          this.arrExpenses = await this.expenseService.getExpensesByGroup(params.groupId);
          this.arrUsers = await this.userService.getUsersByGroup(params.groupId);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  editExpense(expenseId: number) {
    this.router.navigate([`/home/expenses/${this.groupId}/edit/${expenseId}`]);
  }

  async deleteExpense() {
    if (this.expenseId !== -1) {
      try {
        const exp = await this.expenseService.deleteExpenseById(this.expenseId);

        /* Como sólo el admin puede eliminar, no tiene sentido recgargar con BD */
        this.arrExpenses = this.arrExpenses.filter((expense) => expense.id !== this.expenseId);
      } catch (error: HttpErrorResponse | any) {
        console.error(error);
        alert(`Se produjo el siguiente problema: ${error.error.error}`);
      }
    } else {
      console.error('No expense selected');
    }
  }

  saveIdExpense(expenseId: number) {
    this.expenseId = expenseId;
  }

  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

  formatAmount(amount: number): string {
    let strAmount: string = amount.toString();
    strAmount = strAmount.replace('.', ',');
    strAmount = strAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return strAmount + ' €';
  }

  getUserName(userId: number): string {
    const user: IUser | undefined = this.arrUsers.find(
      (user) => user.id === userId
    );
    return user ? user.firstname : '';
  }

  async getIsAdmin() {
    let roles: IRoles | any = {};

    try {
      const roles = await this.groupService.getUserRolesByGroup();

      if (roles.admingroups.includes(Number(this.groupId))) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } catch (error: HttpErrorResponse | any) {
      console.error(error);
      alert(`Se produjo el siguiente problema: ${error.error.error}`);
    }
  }
}
