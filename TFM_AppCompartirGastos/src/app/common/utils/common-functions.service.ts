import { Injectable, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { AlertModalComponent, IAlertData } from '../../components/alert-modal/alert-modal.component';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  authServices = inject(AuthService);
  usersServices = inject (UsersService)
  alertModalService = inject(AlertModalService);
  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;


  constructor() {}

  /**
   * Método para verificar que las las dos contraseñas coinciden
   */
  passwordControl(
    formValue: AbstractControl
  ): { passwordControl: boolean } | null {
    const password = formValue.get('password')?.value;
    const passwordConfirm = formValue.get('password_confirm')?.value;

    if (password !== passwordConfirm) {
      return { passwordControl: true };
    } else {
      return null;
    }
  }

  /**
   * Método para verificar si el token de localStorage es válido
   * @returns una promesa que se resuelve con un ojeto contenente el payload del token o un error
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const tokenResponse = await this.authServices.verifyToken(token);
      return { success: true, data: tokenResponse };
    } catch (error) {
      alert(error);
      return { success: false, error: error };
    }
  }

  /**
   * Método que veriifica si el username tecleado existe en BBDD
   */
  async checkUsername(username: string, $event: any) {
    const currentUsername = $event.target.value;
    if (username !== currentUsername) {
      try {
        const usernameExists = await this.usersServices.checkUsename(
          currentUsername
        );
        return usernameExists.exists
      } catch (error: any) {
        console.log(error.message)
        return false
      }
    }
    return false;
  }

  /**
   * Método para mostrar un mensaje de alerta
   */
  async openDialog(modalData: IAlertData) {
    this.alertModal = this.alertModalService.open(modalData);
  }
}
