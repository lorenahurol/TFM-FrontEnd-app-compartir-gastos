import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IRoles } from '../interfaces/iroles.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private httpClient = inject(HttpClient)

  // URL de entorno
  private API_URL: string | undefined;
   
  constructor() { 
    this.API_URL = environment.API_URL;
  }

  /**
   * Método para obtener todos los roles (grupos como admin y grupos como miembro) que tiene el usuario logueado (sólo se envía el token)
   */
  getUserRolesByGroup(): Promise<IRoles> {
    return lastValueFrom(this.httpClient.get<IRoles>(`${this.API_URL}/groups/roles`));
  }
}
