import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvitationsService } from '../../services/invitations.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import { UsersService } from '../../services/users.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { AuthService } from '../../services/auth.service';
import { GroupsService } from '../../services/groups.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { EmailsService } from '../../services/emails.service';

export type IUsername = {
  username: string,
  id: number
}

@Component({
  selector: 'app-add-group-members',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './add-group-members.component.html',
  styleUrl: './add-group-members.component.css',
})
export class AddGroupMembersComponent {
  private usernameInputSubject: Subject<string> = new Subject<string>();

  HttpClient = inject(HttpClient);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  invitationsService = inject(InvitationsService);
  usersService = inject(UsersService);
  groupsService = inject(GroupsService);
  alertModalService = inject(AlertModalService);
  emailServices = inject(EmailsService)

  groupId: number | null = null;
  userId: number | null = null;
  username: string = '';

  adminUserId: number | null = null;
  isAdmin: boolean = false;
  authService = inject(AuthService);

  arrInvitedUsers: IUsername[] = [];
  arrMembers: IUsername[] = []; // miembros del grupo
  arrUsernameSuggestions: IUsername[] = [];
  modalResponseMessage: string = ""

  constructor() {}


  /**
   * Lógica de ejecución al iniciar el componente. Se obtiene el token del localStorage y se verifica si es válido.
   * Se obtiene el id del grupo a través de los parámetros de la URL, se comprueba si el usuario es admin del grupo.
   * Se suscribe a los cambios del input de username para obtener sugerencias de usuarios.
   */
  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenVerification = await this.authService.verifyToken(token);
      if (tokenVerification && tokenVerification.id) {
        this.userId = tokenVerification.id;
      }
    }
    this.activatedRoute.params.subscribe((params: any) => {
      if (params['groupId']) {
        this.groupId = parseInt(params['groupId']);
      }
    });
    await this.getIsAdmin();
    this.usernameInputSubject.pipe(debounceTime(200), distinctUntilChanged()).subscribe((currentUsername) => {
        this.usernameSuggestions(currentUsername);
      });

    try {
      // cargamos los miembros del grupo para filtrarlos de las sugerencias
      this.arrMembers = await this.usersService.getUsersByGroup(Number(this.groupId));
    } catch (error: any) {
      console.error(error);
    }
    
  }

  /**
   * Método para obtener los datos del formulario y enviar la invitación
   * @param invitationForm formulario de la invitación
   */
  async getDataForm(invitationForm: any) {
    
    if (this.arrInvitedUsers.length > 0 && this.isAdmin) {
      const { message } = invitationForm.value;
      const promises = this.arrInvitedUsers.map(async user => {
        try {
          const existingInvitation = await this.invitationsService.getInvitation(this.groupId!, user.id);
          if (existingInvitation) {
            await this.invitationsService.deleteInvitation(existingInvitation.id!);
          }
          const invitation: IInvitation = {
            group_id: this.groupId!,
            user_id: user.id,
            accepted: 0,
            active: 1,
            message: message,
          };
          const result = await this.invitationsService.createInvitation(invitation);
          if (result.affectedRows === 1) {
            this.modalResponseMessage += `${user.username}: Envío correcto\n`;
          } else {
            this.modalResponseMessage += `${user.username}: Error\n`;
          }
        } catch (error: any) {
          console.log('Error al crear la invitación', error);
          this.modalResponseMessage += `${user.username}: Error\n`;
        }
      });
      await Promise.all(promises);
      
      let bcc: number[] = []
      this.arrInvitedUsers.forEach(user => bcc.push(user.id))
      const emailBody = {
        bcc: bcc,
        html: message,
        selectedTemplate : "invitation"
      }
      this.emailServices.sendEmail(emailBody)
      
      const alertModal = this.alertModalService.newAlertModal({
        icon: 'done_all',
        title: 'Perfecto!',
        body: `${this.modalResponseMessage}`,
        acceptAction: true,
        backAction: false,
      });
      alertModal?.componentInstance.sendModalAccept.subscribe((isAccepted) => {
        if (isAccepted) {
          this.router.navigateByUrl(`/home/groups/${this.groupId}`);
        }
      });


    } else if (!this.isAdmin) {
      this.alertModalService.newAlertModal({
        icon: 'error',
        title: 'Error!',
        body: 'No tienes permiso para crear una invitación',
        acceptAction: true,
        backAction: false,
      });
    }
  }

  /**
   * Método para verificar si el usuario es administrador del grupo
   */
  async getIsAdmin() {
    try {
      const roles = await this.groupsService.getUserRolesByGroup();
      if (roles.admingroups.includes(Number(this.groupId))) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } catch (error: HttpErrorResponse | any) {
      console.error(error);
      this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Problema al verificar rol',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }

  /**
   * Método para añadir o quitar usuarios de la lista de invitados
   * @param invitationForm formulario de la invitación
   * @param event evento del botón
   * @param selectedUser usuario seleccionado
   * @param action acción a realizar (añadir o quitar)
   */
  editInvitations(invitationForm: any, event: any, selectedUser: IUsername, action: string) {
    event.preventDefault();
    if (action === 'add') {
      this.arrInvitedUsers.push(selectedUser);
    } else {
      this.arrInvitedUsers = this.arrInvitedUsers.filter(
        (user) => user.id !== selectedUser.id
      );
    }
    const usernameControl = invitationForm.controls.username;
    if (usernameControl) {
      usernameControl.reset();
      this.arrUsernameSuggestions = [];
    }
  }

  /**
   * Método para obtener las sugerencias de usuarios a partir del input de username
   * @param event evento del input
   */
  onUsernameInput(event: any) {
    const currentUsername = event.target.value;
    if (currentUsername.length > 0) this.usernameInputSubject.next(currentUsername);
    if (currentUsername.length == 0) this.arrUsernameSuggestions = [];
  }

  /**
   * Método para obtener sugerencias de usuarios a partir del input de username, se llama en el evento onInit del componente
   * @param currentUsername username actual
   */
  async usernameSuggestions(currentUsername: string) {
    this.arrUsernameSuggestions = await this.usersService.getUsernames(currentUsername);
    /* filtrar aquellos que ya se han seleccionado (arrInvitedUsers) */
    this.arrUsernameSuggestions = this.arrUsernameSuggestions.filter(
      (user) =>
        !this.arrInvitedUsers.some((invitedUser) => invitedUser.username === user.username)
    );
    /* filtrar aquellos que ya forman parte del grupo (arrMembers) */
    this.arrUsernameSuggestions = this.arrUsernameSuggestions.filter(
      (user) =>
        !this.arrMembers.some((member) => member.username === user.username)
    );
  }

}
