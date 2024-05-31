import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IExpense } from '../interfaces/iexpense.interface';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ExpensesService {
  private httpClient = inject (HttpClient);

  // URL de entorno
  private API_URL: string | undefined;
   
  constructor() { 
    this.API_URL = environment.API_URL;
  }

  /**
   * Método para obtener todos los gastos del grupo
   */
  getExpensesByGroup(groupId: number): Promise<IExpense[]> {
    return lastValueFrom(this.httpClient.get<IExpense[]>(`${this.API_URL}/expenses/bygroup/actives/${groupId}`));
  }

    /**
   * Método para obtener todos los gastos del grupo
   */
    getPaymentsGroup(groupId: number) {
      // let expenses :IExpense[] =[];
      // lastValueFrom(this.httpClient.get<IExpense[]>(`${this.API_URL}/expenses/bygroup/actives/${groupId}`));
      // const amounts: number [] = expenses.map(expensesItem =>{ return expensesItem.amount});
      // let average: number = 0;
      // let total : number = 0;

      // for (let item of expenses)
      // {
      //   total += item.amount;
      // }

      // if(total > 0 && expenses.length > 0)
      // {
      //   average = total / expenses.length;
      // }

      //Necesito el total de gasto de cada usuario del grupo
      
    }


  /**
   * Método para obtener un gasto
   */
  getExpenseById(expenseId: number): Promise<IExpense> {
    return lastValueFrom(this.httpClient.get<IExpense>(`${this.API_URL}/expenses/${expenseId}`));
  }

  /**
   * Método para añadir un gasto
   */
  addExpense(expense: IExpense): Promise<IExpense> {
    return lastValueFrom(this.httpClient.post<IExpense>(`${this.API_URL}/expenses`, expense));
  }

  /**
   * Método para editar un gasto
   */
  editExpense(expense: IExpense): Promise<IExpense> {
    console.log(expense);
    return lastValueFrom(this.httpClient.put<IExpense>(`${this.API_URL}/expenses/${expense.id}`, expense));
  }

  /**
   * Metodo para eliminar un gasto por id
   */
  deleteExpenseById(expenseId: number)
  {
    return firstValueFrom(this.httpClient.delete<IExpense>(`${this.API_URL}/expenses/${expenseId}`));
  }
  
}
