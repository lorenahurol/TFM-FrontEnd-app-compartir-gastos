import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IGroup } from '../interfaces/igroup.interface';
import { Icategory } from '../interfaces/icategory.interface';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  // Inyectar HttpClient:
  private httpClient = inject(HttpClient);
  // URL de entorno:
  private API_URL: string | undefined;

  constructor() {
    this.API_URL = environment.API_URL
  }

  // Array vacio de Grupo y de Categorias:
  private arrGroup: IGroup[] = [];
  private arrCategories: Icategory[] = [];
  private id: number = 1;
  
  // Getter: Obtener todos los grupos:
  getAllGroups(): Promise<IGroup[]> {
    return lastValueFrom(this.httpClient.get<IGroup[]>(`${this.API_URL}/groups`))
  }

  // Get Group By Id:
  getGroupById(group_id: number): Promise<IGroup> {
    return lastValueFrom(this.httpClient.get<IGroup>(`${this.API_URL}/groups/${group_id}`))
  }

  /** Crear categories.js en backend
  getAllCategories(): Icategory[] {
    return lastValueFrom(this.httpClient.get<Icategory[]>(`${this.API_URL}/categories`))
  } **/

  // Insertar grupo:
  addGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.post<IGroup>(`${this.API_URL}/`, group));
  }

  // Editar un grupo:
  editGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.put<IGroup>(`${this.API_URL}/groups/${group.id}`, group));
  }

  // Eliminar (Desactivar) grupo:
  deleteGroup(group: IGroup): Promise<IGroup> {
    return lastValueFrom(this.httpClient.delete<IGroup>(`${this.API_URL}/groups/${group.id}`));
  }
  
}


  
 

  

  