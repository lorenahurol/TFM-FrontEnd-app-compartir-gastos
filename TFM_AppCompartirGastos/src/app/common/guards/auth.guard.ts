import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AlertModalService } from '../../services/alert-modal.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authServices = inject (AuthService)
  const token = localStorage.getItem('login_token')
  const alertModalService = inject(AlertModalService)

  // comprueba que hay token en local storage y lo verifica en la API
  if (token) {
    const response = await(authServices.verifyToken(token))
    if (response.error) return false
    return true
  } else {
      const alertModal = alertModalService.newAlertModal({
        icon: 'warning',
        title: 'Acceso denegado',
        body: 'Para acceder necesitas estar autenticado. Te llevamos al login',
        acceptAction: true,
        backAction: false,
      });
      alertModal?.componentInstance.sendModalAccept.subscribe(
        (isAccepted) => {
          if (isAccepted) {
            router.navigateByUrl('/login');
          }
        }
      );
    return false;
  }
};
