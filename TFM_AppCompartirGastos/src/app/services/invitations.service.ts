import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';
import { IInvitation } from '../interfaces/iinvitation.interface';

@Injectable({
  providedIn: 'root'
})
export class InvitationsService {

  // Inject HTTP client:
  private httpClient = inject(HttpClient);
  // URL de entorno:
  private API_URL: string = environment.API_URL;
  
  // Send invitation to DB:
  async createInvitation(invitation: IInvitation) {
    try {
      const result = await lastValueFrom(this.httpClient.post<any>(`${this.API_URL}/invitations`, invitation));
      return result;
    } catch (error) {
      throw new Error("Error al crear la invitation");
    }
  }

  // Get user_id associated to username:
  async getUsersByUsername(usernames: string[]): Promise<IUser> {
    try {
      // Get usernames from DB:
      const result = await lastValueFrom(this.httpClient.post<IUser>(`${this.API_URL}/users/byusername`, usernames));
      return result
    } catch (error) {
      throw new Error("No se ha encontrado el usuario");
    }
  }

  // Get invitation associated with group and user: **REVISAR SI ES NECESARIO**
  async getInvitation(groupId: number, userId: number): Promise<IInvitation | null> {
    try {
      // Get PENDING (not accepted) invitations from DB:
      const result = await lastValueFrom(this.httpClient.get<IInvitation[]>(`${this.API_URL}/invitations/bygroupanduser/${groupId}/${userId}`));
      // Para evitar error si devuelve un array vacio:
      return result.length > 0 ? result[0] : null;
    } catch (error) {
      throw new Error("No se ha encontrado la invitación");
    }
  }
  
  // Get all invitations for the logged in user:
  async getInvitationsByUser(userId: number): Promise<IInvitation[]>{
    try {
      const result = await lastValueFrom(this.httpClient.get<IInvitation[]>(`${this.API_URL}/invitations/byuser/${userId}`))
      return result;
    } catch (error) {
      throw new Error("No se han encontrado invitaciones");
    }
  }


  // accept or reject invitation
  async updateInvitation(invitation: IInvitation): Promise<any> {
    try {
      const result = await lastValueFrom(this.httpClient.put(`${this.API_URL}/invitations`, invitation));
      return result;
    } catch (error) {
      throw new Error("Error al actualizar la invitación");
    }
  }

  // Deactivate invitation:
  async deleteInvitation(invitationId: number): Promise<any> {
    try {
      const result = await lastValueFrom(this.httpClient.delete(`${this.API_URL}/invitations/${invitationId}`));
      return result
    } catch (error) {
      throw new Error("Error al eliminar la invitación");
    }
  }
}