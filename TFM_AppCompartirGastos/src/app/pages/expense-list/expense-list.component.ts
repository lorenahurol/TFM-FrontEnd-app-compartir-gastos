import { Component, inject } from '@angular/core';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../../components/alert-modal/alert-modal.component';

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
  commonFunc = inject(CommonFunctionsService);
  router = inject(Router);

  // manejo de la ventana modal de borrado
  alertModalService = inject(AlertModalService);
  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;
  
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
        this.commonFunc.openDialog({
          icon: 'notifications',
          title: 'Problema al eliminar gasto',
          body: `Se produjo el siguiente problema: ${error.error.error}`,
          acceptAction: true,
          backAction: false,
        });
      }
    } else {
      console.error('No expense selected');
    }
  }

  deleteExpenseById(expenseId: number) {
    this.expenseId = expenseId;

    this.openDialog({
      icon: 'notifications',
      title: 'Eliminar gasto',
      body: '¿Estás seguro de que quieres eliminar este gasto?',
      acceptAction: true,
      backAction: true,
    });
    this.alertModal?.componentInstance.sendModalAccept.subscribe(
      (isAccepted) => {
        if (isAccepted) {
          this.deleteExpense();
        }
      }
    );
  
  }

  // Instancia el modal alert-modal-component para el dialog de borrado
  openDialog(modalData: IAlertData): void {
    this.alertModal = this.alertModalService.open(modalData);
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
      this.commonFunc.openDialog({
        icon: 'notifications',
        title: 'Problema al eliminar gasto',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }
}
