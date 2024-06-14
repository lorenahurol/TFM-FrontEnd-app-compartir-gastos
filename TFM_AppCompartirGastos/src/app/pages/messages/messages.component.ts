import { Component, inject } from '@angular/core';
import { MessengerComponent } from '../../components/messenger/messenger.component';
import { AuthService } from '../../services/auth.service';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { GroupsService } from '../../services/groups.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [MessengerComponent],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {
  activatedRoute = inject(ActivatedRoute);
  authService = inject(AuthService);
  groupService = inject(GroupsService);
  router = inject(Router);
  userId!: number;
  groupId!: number;
  arrInfoGroups: IUserGroups[] = [];


   async ngOnInit() {

    // Establecer como grupo seleccionado el que recibe la página como parámetro (si no se recibe, tendrá que cogerlo del desplegable)
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
      }
    });

    // Obtener usuario de sesión
    const token = localStorage.getItem("login_token");
    if (token) {
      const tokenVerification = await this.authService.verifyToken(token);
      if (tokenVerification && tokenVerification.id) {
        this.userId = tokenVerification.id;
      }
    }

    // Cargar grupos del usuario logueado
    this.arrInfoGroups = await this.groupService.getAllInfoGroupsByUser();
   }

   isGroupId(id: number): boolean {
    return Number(this.groupId) === Number(id);
   }

   changeGroup(target: any){
    this.groupId = target.value;
   }

}