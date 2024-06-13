import { Component, ElementRef, Input, Renderer2, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { IMessage } from '../../interfaces/imessage.interface';
import { IGroup } from '../../interfaces/igroup.interface';
import { MessagesService } from '../../services/messages.service';
import { FormsModule } from '@angular/forms';
import dayjs from 'dayjs';

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

  msgService = inject(MessagesService);
  

  arrGroups: IGroup [] = [];
  userActived!: IUser;
  arrMessages: IMessage [] = [];
  newMessage: string = '';
  //userId: number = 102;
  //groupId: number = -1;

  constructor(private renderer: Renderer2, private el: ElementRef) { }

  async ngOnChanges() {
    console.log("this.groupId", this.groupId);
    console.log("this.userId", this.userId);
    console.log(this.arrMessages);
    try {
      if (this.arrMessages.length === 0 && this.groupId !== undefined) {
        this.arrMessages = await this.msgService.getMessagesByGroupId(this.groupId);
    
      }
    } catch (error) {
      console.log(error);
    }
  }

  async sendMessage() {
    if (this.newMessage !== '') {
      console.log("Tu mensaje: ", this.newMessage);

      let newIMessage: IMessage = {
        message: this.newMessage,
        user_id: this.userId,
        group_id: this.groupId
      };
      newIMessage = await this.msgService.addMessage(newIMessage);
      console.log("newIMessage", newIMessage);
      this.arrMessages.push(newIMessage);
    }
  }

  dateFormat(stringDate: string | any) {
    return dayjs(stringDate).format('DD/MM/YYYY HH:mm');
  }

}
