import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import {internationalCodes} from '../db/international_codes.db'

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  private arrInternationalCodes: Array<object> = internationalCodes;

  // Recupera la lista de códigos de país del fichero ../db/international_codes.db
  getAllInternationalCodes(): Array<object> {
    return this.arrInternationalCodes;
  }
}
