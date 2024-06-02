import { Component, inject } from '@angular/core';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import dayjs from 'dayjs';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { firstValueFrom } from 'rxjs';
import { ImemberGroup } from '../../interfaces/imember-group';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './expense-list.component.html',
  styleUrl: './expense-list.component.css'
})
export class ExpenseListComponent {
  arrExpenses: IExpense[] = [];
  arrUsers: IUser[] = [];
  groupId: string = '';
  expenseService = inject(ExpensesService);
  userService = inject(UsersService);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  expenseId: number = -1;
  
  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        try {
          this.arrExpenses = await this.expenseService.getExpensesByGroup(params.groupId);
          this.arrUsers = await this.userService.getUsersByGroup(params.groupId);
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

  async deleteExpense() {
    if(this.expenseId != -1)
      {
        const exp = await this.expenseService.deleteExpenseById(this.expenseId);
        try {
          this.arrExpenses = await this.expenseService.getExpensesByGroup(Number(this.groupId));
          this.arrUsers = await this.userService.getUsersByGroup(Number(this.groupId));
        } catch (error) {
          console.error(error);
        }
      }

  }

  async getPayments(){
    //Recupero todos los gastos del grupo agrupados por usuario
    const totalExpenses:any [] = await this.expenseService.getExpensesGroupingByUser(Number(this.groupId));
    console.log(totalExpenses);
    
    //Recupero los miembros del grupo
    const members: any[] = await this.userService.getMemberUserByGroup(Number(this.groupId));
    console.log(members);

    const membersAll: Array<ImemberGroup> = [];

    /* Recorro el array de miembros y busca en el array de gastos por pagador para cruzarlos
     y montar un nuevo array con toda informarcion, usando la interface IMenber-group
     calculo el gasto total del grupo y el numero de usuarios en el grupo.
     */

    let totalE: number = 0;
    for(let mb of members)
    {
      let member : ImemberGroup;
      member = {
        id: mb.user_id,
        group_id: mb.group_id,
        totalEx: 0,
        percent: mb.percent,
        equitable: true,
        credit: 0
      }

      if(mb.equitable == 0)
      {
          member.equitable = false;
      }
      const foundElement = totalExpenses.find(element => element.payer_user_id === mb.user_id);
      if(foundElement)
      {
        member.totalEx = foundElement.total_expenses;
      }

      membersAll.push(member);
      totalE += member.totalEx;
    }

    //Calculo los que tienen un porcentaje especifico y no comparten a partes iguales
    const noEquitableMembers : Array<ImemberGroup> = membersAll.filter(m => m.equitable === false);
    let totalNoEquitable: number = 0;
    if(noEquitableMembers.length > 0)
    {
      
      for(let member of noEquitableMembers)
      {
        let xcredit = (member.percent * totalE) - member.totalEx;
        totalNoEquitable += xcredit;
        member.credit = - xcredit;
      }
    }

    //Calculo los que tienen un porcentaje 0 y comparten a partes iguales
    const equitableMembers : Array<ImemberGroup> = membersAll.filter(m => m.equitable === true);
    console.log(equitableMembers.length);
    if(equitableMembers.length > 0)
    {
      let avegareExpenses: number = (totalE - totalNoEquitable) / equitableMembers.length ;
      console.log("La media a pagar es : "+avegareExpenses);
      for(let member of equitableMembers)
      {
        let xcredit = avegareExpenses - member.totalEx;
        totalNoEquitable += xcredit;
        member.credit = - xcredit;
      }
    }

    console.log(totalE);

    membersAll.forEach(x => console.log(x));


  

    





  }

  saveIdExpense(expenseId: number){
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
    const user: IUser | undefined = this.arrUsers.find((user) => user.id === userId);
    return user ? user.firstname : '';
  }

}
