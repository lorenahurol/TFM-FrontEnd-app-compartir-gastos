import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IExpense } from '../interfaces/iexpense.interface';
import { lastValueFrom } from 'rxjs';

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
   * Método para obtener un gasto
   */
  getExpenseById(expenseId: number): Promise<IExpense> {
    return lastValueFrom(this.httpClient.get<IExpense>(`${this.API_URL}/expenses/${expenseId}`));
  }
}
