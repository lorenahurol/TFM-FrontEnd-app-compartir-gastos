import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environments';

export type IEmailData = {
  bcc: number[];
  html?: string;
  selectedTemplate: string;
  groupName?: string;
  balance?: object;
};

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private httpClient = inject(HttpClient)
  private API_URL: string | undefined = environment.API_URL

  constructor() { }

  /**
   * Función que se encarga de enviar un email a través de la API
   * @param emailData Objeto con los datos del email a enviar
   * @returns 
   */
  sendEmail(emailData: IEmailData) {
    try {
      return lastValueFrom(
        this.httpClient.post<any>(`${this.API_URL}/mails/`, emailData)
      );
    } catch (error) {
      return error;
    }
  }


}
