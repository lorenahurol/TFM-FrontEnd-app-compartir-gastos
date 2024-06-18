import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { lastValueFrom } from 'rxjs';

export type IPayment = {
  user_id: number,
  credit: number,
  group_id: number
}

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private httpClient = inject (HttpClient);

  // URL de entorno
  private API_URL: string | undefined;
   
  constructor() { 
    this.API_URL = environment.API_URL;
  }

    /**
   * Método para añadir un pago
   */
  addPayment(arrPayments : Array<IPayment>): Promise<any> {
    return lastValueFrom(this.httpClient.post<any>(`${this.API_URL}/payments`,arrPayments ));
  }

}
