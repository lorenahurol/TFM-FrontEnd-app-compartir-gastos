import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IGroup } from '../interfaces/igroup.interface';
import { Icategory } from '../interfaces/icategory.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  // Inyectar HttpClient:
  private httpClient = inject(HttpClient);
  // Array vacio de Grupo y de Categorias:
  private arrGroup: IGroup[] = [];
  private arrCategories: Icategory[] = [];
  private id: number = 1;
  
  // Getter:
  getAll(): IGroup[] {
    return this.arrGroup;
  }

  // Get Group By Id:
  getById(id: number): IGroup | undefined {
    return this.arrGroup.find(group => group.id === id);
  }

  // Get All Categories:
  getAllCategories(): Icategory[] {
    return this.arrCategories;
  }

  // Insertar grupo:
  insert(group: IGroup): string {
    group.id = this.id;
    this.arrGroup.push(group); // ** Hacer peticion a BD ** //
    this.id++;
    return "El grupo ha sido creado correctamente";
  }
}


  
 

  

  