import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environments';

export type IEmailData = {
  bcc: number[];
  html?: string;
  selectedTemplate: string;
};

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private httpClient = inject(HttpClient)
  private API_URL: string | undefined = environment.API_URL

  constructor() { }

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
