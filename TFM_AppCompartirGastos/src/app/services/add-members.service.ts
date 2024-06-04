import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  // Inject HTTP client:
  private HttpClient = inject(HttpClient);
  // URL de entorno:
  private API_URL: string | undefined;

  constructor() {
    this.API_URL = environment.API_URL
  }
  
  // Getter: Obtener todos los usuarios:
  getAllUsers(): Promise<IUser[]> {
    return lastValueFrom(this.HttpClient.get<IUser[]>(`${this.API_URL}/users`));
  }

  // Comprobar si existe el email del usuario:
  
}
