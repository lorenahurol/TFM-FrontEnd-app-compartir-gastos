import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { IGroup } from '../interfaces/igroup.interface';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {
  private httpClient = inject(HttpClient)
  private arrGroup: IGroup[] = [];
  private id: number = 1;
  
  // Getter:
  getAll(): IGroup[] {
    return this.arrGroup;
  }

  // Getter by ID:
  getById(id: number): IGroup | undefined {
    return this.arrGroup.find(group => group.id === id);
  }

  // Insertar grupo:
  insert(group: IGroup): string {
    group.id = this.id;
    this.arrGroup.push(group); // ** Hacer peticion a BD ** //
    this.id++;
    return "El grupo ha sido creado correctamente";
  }
}
