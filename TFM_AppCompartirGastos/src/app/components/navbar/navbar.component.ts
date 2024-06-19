import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { InvitationsService } from '../../services/invitations.service';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  authService = inject(AuthService);
  invitationsService = inject(InvitationsService);
  alertModalService = inject(AlertModalService);

  isLoggedIn: boolean = false;
  userId: number = 1;
  invitations: any[] = [];

  navigate(destination: string) {
    this.router.navigate(['/landing']).then(() => {
      this.viewportScroller.scrollToAnchor(destination);
    });
  }

  async ngOnInit(): Promise<void> {
    // subscribe al observable de estado de login
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn
    })
    const token = localStorage.getItem("login_token");
    if (token) {
      try {
        const tokenVerification = await this.authService.verifyToken(token);
        if (tokenVerification && tokenVerification.id) {
          // this.authService.loginSubject(true)
          // this.isLoggedIn = true;
          this.userId = tokenVerification.id;
          this.loadInvitations();
        }
      } catch (error) {
        this.isLoggedIn = false;
      }
    }
  }


  async loadInvitations() {
    try {
      const invitations = await this.invitationsService.getInvitationsByUser(this.userId);
      this.invitations = invitations;
    } catch (error) {
      console.error("Error loading invitations");
    }
  }

  // Método para aceptar o rechazar invitaciones:
  async handleInvitation(invitationId: number, action: 'accept' | 'reject') {
    try {
      // Llamar al servicio para aceptar o rechazar la invitación
      let invitation: IInvitation = this.invitations.find(invitation => invitation.id === invitationId);
      if (action === 'accept') {
        invitation.accepted = 1;
      } else if (action === 'reject') {
        invitation.active = 0;
      }
      await this.invitationsService.updateInvitation(invitation);
      // Invitacion aceptada:

      // Actualizar la lista de invitaciones
      this.invitations = this.invitations.filter(invitation => invitation.id !== invitationId);

      if (action === "accept") {
        this.alertModalService.newAlertModal({
          icon: 'done_all',
          title: 'Invitación aceptada',
          body: `Invitación ${invitationId} aceptada correctamente.`,
          acceptAction: false,
          backAction: true
        })
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
    this.authService.logout()
    this.isLoggedIn = false; 
    this.router.navigate(['/login'])
  }
}