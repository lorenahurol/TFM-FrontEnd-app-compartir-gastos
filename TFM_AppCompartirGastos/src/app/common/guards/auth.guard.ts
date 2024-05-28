import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authServices = inject (AuthService)
  const token = localStorage.getItem('login_token')

  // comprueba que hay token en local storage y lo verifica
  if (token) {
    const response = await(authServices.verifyToken(token))
    if (response.error) return false
    return true
  } else {
    alert ('Necesitas estar autenticado')
    router.navigateByUrl('/login')
    return false;
  }
};
