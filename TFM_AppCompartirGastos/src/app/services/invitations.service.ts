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
  
  // Getter: Obtener todos los usuarios:
  getAllUsers(): Promise<IUser[]> {
    return lastValueFrom(this.HttpClient.get<IUser[]>(`${this.API_URL}/users`));
  }

  // Send invitation to DB:
  createInvitation(data: { username: string, groupId: string, message?: string }): Promise<IInvitation> {
    return lastValueFrom(this.HttpClient.post<IInvitation>(`${this.API_URL}/invitations`, data));
  }
}