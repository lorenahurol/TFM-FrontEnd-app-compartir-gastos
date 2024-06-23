import { Component, Input, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { Router } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense } from '../../interfaces/iexpense.interface';

@Component({
  selector: 'app-group-info-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './group-info-card.component.html',
  styleUrl: './group-info-card.component.css'
})
export class GroupInfoCardComponent {
  @Input() infoGroup!: IUserGroups;

  router = inject(Router);
  expenseService = inject(ExpensesService);
  totalGroupExpenses: number = 0;

  async ngOnInit()
  {
    try{
      if(this.infoGroup !== undefined){
        let expenses: IExpense [] = await this.expenseService.getExpensesByGroup(this.infoGroup.group_id);
        if(expenses.length > 0){
          this.totalGroupExpenses = expenses.reduce((accumulator,currentValue) => accumulator + currentValue.amount, 0); 
        } 
      }
    }catch(error){
      console.log("Error: "+error);
    }
    
  }

  async ngOnChanges()
  {
    try{
      if(this.infoGroup !== undefined){
        let expenses: IExpense [] = await this.expenseService.getExpensesByGroup(this.infoGroup.group_id);
        if(expenses.length > 0){
          this.totalGroupExpenses = expenses.reduce((accumulator,currentValue) => accumulator + currentValue.amount, 0); 
        } 
      }
    }catch(error){
      console.log("Error: "+error);
    }
  }

  formatAmount(amount: number | undefined): string {
    if (amount === undefined) {
      return '';
    } else {
      let strAmount: string = amount.toFixed(2).toString();
      strAmount = strAmount.replace('.', ',');
      strAmount = strAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
      return strAmount + ' €';
    }
  }

  isGroupHome(): boolean {
    return this.router.url.includes('/home/groups');
  }

  goToGroup(group_id: number) {
    this.router.navigate([`/home/groups/${group_id}`]);
  }

  goToHome() {
    this.router.navigate([`/home`]);
  }
}
