import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {internationalCodes} from '../db/international_codes.db'
import { IUser } from '../interfaces/iuser.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  private arrInternationalCodes: Array<object> = internationalCodes;

  private url = 'http://localhost:3000/api';

  // Recupera la lista de códigos de país del fichero ../db/international_codes.db
  getAllInternationalCodes(): Array<object> {
    return this.arrInternationalCodes;
  }

  // Registro de nuevo usuario
  createNewUser(formValue: IUser): Observable<IUser> {
    return this.httpClient.post <IUser>(`${this.url}`,formValue);
  }
}
