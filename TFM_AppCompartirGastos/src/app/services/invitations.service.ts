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
  private HttpClient = inject(HttpClient);
  // URL de entorno:
  private API_URL: string = environment.API_URL;
  
  // Send invitation to DB:
  async createInvitation(invitation: IInvitation): Promise<IInvitation> {
    try {
      const result = await lastValueFrom(this.HttpClient.post<IInvitation>(`${this.API_URL}/invitations`, invitation));
      return result;
    } catch (error) {
      throw new Error("Error creating invitation");
    }
  }

  // Get user_id associated to username:
  async getUserFromUsername(username: string): Promise<IUser> {
    try {
      const result = await lastValueFrom(this.HttpClient.get<IUser>(`${this.API_URL}/users/byusername/${username}`));
      return result

  } catch (error) {
    throw new Error("User ID not found");
  }
}
}