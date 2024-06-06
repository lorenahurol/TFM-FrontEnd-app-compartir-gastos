import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationsService } from '../../services/invitations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import { UsersService } from '../../services/users.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../alert-modal/alert-modal.component';

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
  alertModalService = inject(AlertModalService);

  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;
  groupId: number | null = null;
  userId: number | null = null;
  username: string = "";

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

  // Recoger groupId:
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params['groupId']) {
        this.groupId = parseInt(params['groupId']);
      }
    })
  }

  // Recoger los datos del formulario:
  async getDataForm(): Promise<void> {
    if (this.invitationForm.valid) {
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
      } catch (error) {
        console.log('Error al crear la invitacion:', error);
      }
    }
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.invitationForm.get(formControlName)?.hasError(validatorName) &&
      this.invitationForm.get(formControlName)?.touched
    );
  }
}
