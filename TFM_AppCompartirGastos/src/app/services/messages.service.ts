import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environments';
import { IMessage } from '../interfaces/imessage.interface';


@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  // Inyectar HttpClient:
  private httpClient = inject(HttpClient);
  // URL de entorno:
  private API_URL: string | undefined;

  constructor() { 
    this.API_URL = environment.API_URL;
  }

  // Obtener todos los mensajes de un grupo
  getMessagesByGroupId(group_id: number): Promise<IMessage[]> {
    return lastValueFrom(
      this.httpClient.get<IMessage[]>(`${this.API_URL}/messages/bygroup/${group_id}`)
    );
  }


  // Obtener todos los mensajes de un grupo y un usuario
  getMessagesByUserIdAndGroupId(group_id: number, user_id:number): Promise<IMessage> {
    return lastValueFrom(
      this.httpClient.get<IMessage>(`${this.API_URL}/messages/bygroup/byUser/${group_id}/${user_id}`)
    );
  }

  // Insertar un mensaje:
  addMessage(message: IMessage): Promise<IMessage> {
    return lastValueFrom(
      this.httpClient.post<IMessage>(`${this.API_URL}/messages`, message));
  }

  // Editar un mensaje:
  editMessage(message: IMessage): Promise<IMessage> {
    return lastValueFrom(
      this.httpClient.put<IMessage>(`${this.API_URL}/messages/${message.id}`, message)
    );
  }

  // Eliminar mensaje:
  deleteMessage(message: IMessage): Promise<IMessage> {
    return lastValueFrom(
      this.httpClient.delete<IMessage>(`${this.API_URL}/messages/${message.id}`)
    );
  }


}
