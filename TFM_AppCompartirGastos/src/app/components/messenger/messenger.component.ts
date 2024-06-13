import { Component, ElementRef, Input, inject, AfterViewChecked, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { IMessage } from '../../interfaces/imessage.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { MessagesService } from '../../services/messages.service';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';
import { UsersService } from '../../services/users.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-messenger',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './messenger.component.html',
  styleUrl: './messenger.component.css'
})
export class MessengerComponent {
  @Input() groupId!: number;
  @Input() userId!: number;
  @ViewChild('scrollContainer') private scrollContainer: ElementRef | any;

  msgService = inject(MessagesService);
  userService = inject(UsersService);
  

  arrGroups: IGroup [] = [];
  userActived!: IUser;
  arrMessages: IMessage [] = [];
  newMessage: string = '';
  arrMembers: IUser [] = [];

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
  }

  async ngOnChanges() {
    try {
      if (this.groupId !== undefined) {
        this.arrMessages = await this.msgService.getMessagesByGroupId(this.groupId);
        this.arrMembers = await this.userService.getUsersByGroup(this.groupId);
        // para cada mensaje, vamos a rellenar el campo username
        for (let msg of this.arrMessages) {
          msg.username = this.getUserName(msg.user_id);
        }
      }
    } catch (error: HttpErrorResponse | any) {
      if (error.error.error === 'No hay mensajes') {
        this.arrMessages = [];
      }
      console.log(error);
    }
  }

  getUserName(userId: number) {
    const user = this.arrMembers.find(user => user.id === userId);
    return user ? user.username : '';
  }

  async sendMessage() {
    if (this.newMessage !== '') {
      let newIMessage: IMessage = {
        message: this.newMessage,
        user_id: this.userId,
        group_id: this.groupId
      };
      newIMessage = await this.msgService.addMessage(newIMessage);
      this.arrMessages.push(newIMessage);
      this.newMessage = '';
    }
  }

  dateFormat(stringDate: string | any) {
    return dayjs(stringDate).format('DD/MM/YYYY HH:mm');
  }

}
