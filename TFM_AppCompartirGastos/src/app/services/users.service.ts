import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject (HttpClient);

  // URL de entorno
  private API_URL: string | undefined;

  constructor() { 
    this.API_URL = environment.API_URL;
  }

  /**
   * Método para obtener todos los usuarios activos de un grupo
   */
  getUsersByGroup(groupId: number): Promise<IUser[]> {
    return lastValueFrom(this.httpClient.get<IUser[]>(`${this.API_URL}/users/bygroup/${groupId}`));
  }

}