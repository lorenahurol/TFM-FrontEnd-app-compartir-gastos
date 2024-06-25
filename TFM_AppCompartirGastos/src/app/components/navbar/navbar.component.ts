import { ViewportScroller } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { InvitationsService } from '../../services/invitations.service';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import { MatIconModule } from '@angular/material/icon';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  authService = inject(AuthService);
  invitationsService = inject(InvitationsService);
  alertModalService = inject(AlertModalService);
  groupsService = inject(GroupsService);

  isLoggedIn: boolean = false;
  userId: number | any;
  hasInvitations: boolean = false;
  invitations: IInvitation[] = [];
  processedInvitations: any[] = [];

  async ngOnInit(): Promise<void> {
    // Check login status on initialization
    await this.checkLoginStatus();

    // subscribe to login state observable
    this.authService.isLoggedIn$.subscribe(async isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        await this.getLoginUser();
        this.loadInvitations();
      }
    });
  }

  async checkLoginStatus() {
    const token = localStorage.getItem("login_token");
    if (token) {
      try {
        const tokenVerification = await this.authService.verifyToken(token);
        if (tokenVerification && tokenVerification.id) {
          this.userId = tokenVerification.id;
          this.isLoggedIn = true;
          this.loadInvitations();
        }
      } catch (error) {
        console.error("Token verification failed", error);
        this.isLoggedIn = false;
      }
    }
  }

  async getLoginUser() {
    const token = localStorage.getItem("login_token");
    if (token) {
      try {
        const tokenVerification = await this.authService.verifyToken(token);
        if (tokenVerification && tokenVerification.id) {
          this.userId = tokenVerification.id;
        }
      } catch (error) {
        this.isLoggedIn = false;
      }
    }
  }

  navigate(destination: string) {
    this.router.navigate(['/landing']).then(() => {
      this.viewportScroller.scrollToAnchor(destination);
    });
  }

  async loadInvitations() {
    if (!this.userId) return;

    try {
      this.invitations = await this.invitationsService.getInvitationsByUser(this.userId);
      this.processedInvitations = await Promise.all(
        this.invitations.map(async invitation => {
          const group = await this.groupsService.getGroupById(invitation.group_id);
          return { ...invitation, description: group.description };
        })
      );
    } catch (error) {
      console.error("Error loading invitations", error);
    }
  }

  // Método para aceptar o rechazar invitaciones:
  async handleInvitation(invitationId: number, action: 'accept' | 'reject') {
    try {
      // Llamar al servicio para aceptar o rechazar la invitación
      let invitation: IInvitation = this.processedInvitations.find(invitation => invitation.id === invitationId);
      if (action === 'accept') {
        invitation.accepted = 1;
      } else if (action === 'reject') {
        invitation.active = 0;
      }
      await this.invitationsService.updateInvitation(invitation);
      // Invitacion aceptada:

      // Actualizar la lista de invitaciones
      this.processedInvitations = this.processedInvitations.filter(invitation => invitation.id !== invitationId);

      if (action === "accept") {
        const alertModal = this.alertModalService.newAlertModal({
          icon: 'done_all',
          title: 'Invitación aceptada',
          body: `La invitación al grupo ha sido aceptada correctamente.`,
          acceptAction: true,
          backAction: false
        });

        alertModal?.componentInstance.sendModalAccept.subscribe(
          (isAccepted) => {
            if (isAccepted) {
              location.reload();
            }
          }
      );
      } else if (action === 'reject') {
        this.alertModalService.newAlertModal({
          icon: 'done_all',
          title: 'Invitación rechazada',
          body: `Invitación ${invitationId} rechazada correctamente.`,
          acceptAction: false,
          backAction: true
        });
      }
    } catch (error) {
      console.error(`Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} la invitación ${invitationId}:`, error);
      // Mostrar mensaje de error en caso de fallo al aceptar o rechazar invitación
      this.alertModalService.newAlertModal({
        icon: 'error',
        title: 'Error',
        body: `Error al ${action === 'accept' ? 'aceptar' : 'rechazar'} la invitación ${invitationId}. Por favor, inténtelo de nuevo más tarde.`,
        acceptAction: false,
        backAction: true
      });
    }
  }

  logout() {
    const alertModal = this.alertModalService.newAlertModal({
      icon: 'shield_question',
      title: 'Cierre de sesión',
      body: '¿Estás seguro que quieres cerrar sesión?',
      acceptAction: true,
      backAction: true,
    });
    alertModal?.componentInstance.sendModalAccept.subscribe(
      (isAccepted) => {
        if (isAccepted) {
          this.authService.logout();
          this.isLoggedIn = false;
          this.router.navigate(['/login']);
        }
      }
    );
  }
}
