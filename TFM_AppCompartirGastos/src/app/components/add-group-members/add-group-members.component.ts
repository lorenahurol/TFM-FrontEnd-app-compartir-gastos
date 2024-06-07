import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationsService } from '../../services/invitations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import { UsersService } from '../../services/users.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../alert-modal/alert-modal.component';
import { AuthService } from '../../services/auth.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-add-group-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-members.component.html',
  styleUrl: './add-group-members.component.css'
})
export class AddGroupMembersComponent {

  invitationForm: FormGroup;

  HttpClient = inject(HttpClient);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  invitationsService = inject(InvitationsService);
  usersService = inject(UsersService);
  groupsService = inject(GroupsService);
  alertModalService = inject(AlertModalService);

  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;
  groupId: number | null = null;
  userId: number | null = null;
  username: string = "";

  adminUserId: number | null = null
  isAdmin: boolean = false;
  authService = inject(AuthService);
  commonFunc = inject(CommonFunctionsService);

  // Inicializar el formulario:
  constructor() {
    this.invitationForm = new FormGroup({
      username: new FormControl("", [
        // Validadores:
        Validators.required
      ]),
      message: new FormControl("", [
        Validators.maxLength(400)
      ]),
    }, [])
  }

  // Instancia el modal alert-modal-component para alertas
  openAlertModal(modalData: IAlertData): void {
    this.alertModal = this.alertModalService.open(modalData);
  }

  
 async ngOnInit(): Promise<void> {
    // AuthService: get current user's ID:
  const token = localStorage.getItem("token");
  if (token) {
    const tokenVerification = await this.authService.verifyToken(token);
    if (tokenVerification && tokenVerification.id) {
      this.userId = tokenVerification.id;
    }
  }
    // Recoger groupId:
    this.activatedRoute.params.subscribe((params: any) => {
      if (params['groupId']) {
        this.groupId = parseInt(params['groupId']);
      }
    })
   // Verifica si el user es admin:
   await this.getIsAdmin();
  }

  // Recoger los datos del formulario:
  async getDataForm(): Promise<void> {
    if (this.invitationForm.valid && this.isAdmin) {
      const { username, message } = this.invitationForm.value;
      try {
        const user = await this.invitationsService.getUserFromUsername(username);

        
        // Check if a pending invitation exists for group + user:
        const existingInvitation = await this.invitationsService.getInvitation(this.groupId!, user.id);

          if (existingInvitation !== null) {
            this.openAlertModal({
              icon: 'error',
              title: 'Error!',
              body: 'La invitación ya existe',
              acceptAction: true,
              backAction: false,
            });
            return;
          } 
        
        const invitation: IInvitation = {
          group_id: this.groupId!,
          user_id: user.id,
          accepted: 0,
          active: 1,
          message: message
        }

        // Crear la invitacion:
        const result = await this.invitationsService.createInvitation(invitation);
        console.log(result);

        if (result) {
          this.openAlertModal({
            icon: 'done_all',
            title: 'Perfecto!',
            body: 'Invitación creada correctamente ',
            acceptAction: true,
            backAction: false,
          });
          this.alertModal?.componentInstance.sendModalAccept.subscribe(
            (isAccepted) => {
              if (isAccepted) {
                this.router.navigateByUrl('/home');
              }
            }
          );
        }
      } catch (error: any) {
          console.log('Error al crear la invitación', error);
      }
    // Si el user loggeado no es admin:
    } else if (!this.isAdmin) {
        this.openAlertModal({
          icon: 'error',
          title: 'Error!',
          body: 'No tienes permiso para crear una invitación',
          acceptAction: true,
          backAction: false,
        });
    }
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.invitationForm.get(formControlName)?.hasError(validatorName) &&
      this.invitationForm.get(formControlName)?.touched
    );
  }

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
      this.commonFunc.openDialog({
        icon: 'notifications',
        title: 'Problema al verificar rol',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }
}
