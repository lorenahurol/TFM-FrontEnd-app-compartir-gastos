import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environments';
import { EMAIL_TEMPLATES} from '../db/emailTemplates.db'

type IEmailBody = {
  to?: string,
  subject: string,
  html: string
}

export type IEmailData = {
  to: string;
  name: string;
  selectedTemplate: string;
};

@Injectable({
  providedIn: 'root'
})
export class EmailsService {
  private httpClient = inject(HttpClient)
  private API_URL: string | undefined = environment.API_URL
  private emailTemplates: any = EMAIL_TEMPLATES

  constructor() { }


  sendEmail({ to, name, selectedTemplate }: IEmailData) {
    // mapeo los email importados de app/db/emailTemplates.db
    let template = this.emailTemplates[selectedTemplate];

    // modifico el contenido para personalizar el email sustituyendo los tags por los valores
    template.subject = template.subject.replace('#name', `${name}`);
    template.html = template.html.replace('#name', `${name}`);

    // creo el objeto cuerpo de la petición
    const emailBody: IEmailBody = {
      to: to,
      subject: template.subject,
      html: template.html,
    };

    try {
      return lastValueFrom(
        this.httpClient.post<any>(`${this.API_URL}/mails/`, emailBody)
      );
    } catch (error) {
      return error;
    }
  }


}
