import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../../components/alert-modal/alert-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  alertModalService = inject(AlertModalService);
  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;

  authServices = inject(AuthService);
  router = inject(Router);

  // Instancia el modal alert-modal-component para alertas
  openAlertModal(modalData: IAlertData): void {
    this.alertModal = this.alertModalService.open(modalData);
  }

  /**
   * Handles form submission for login.
   *
   * @param loginForm {FormGroup} - The login form object.
   * @returns {Promise<void>} - A promise that resolves after login attempt.
   *
   */
  async getDataForm(loginForm: any) {
    let loginBody = loginForm.value;
    if (!loginBody.mail || !loginBody.password) {
        this.openAlertModal({
          icon: 'warning',
          title: 'Atención!',
          body: 'Los campos email y contraseña son obligatorios',
          acceptAction: false,
          backAction: true,
        });
    } else {
      // configura manualmente el valor de rememberMe en caso no haya sido tocado por el usuario (por defecto html devuelve un campo vacío en vez de false)
      if (loginBody.rememberMe === '') loginBody.rememberMe = false;
      // recibe el token de login y lo guarda en local storage
      try {
        let response = await this.authServices.login(loginBody);
        localStorage.setItem('login_token', response.token!);
        this.authServices.loginSubject(true)
        this.router.navigateByUrl('/home');
      } catch (err: any) {
          this.openAlertModal({
            icon: 'warning',
            title: 'Atención!',
            body: 'Email o contraseña incorrectos',
            acceptAction: false,
            backAction: true,
          });
      }
    }
  }

  /**
   * Checks for existing login token on component initialization.
   *
   * @returns {Promise<void>} - A promise that resolves after token verification (if any).
   */
  async ngOnInit() {
    const token = localStorage.getItem('login_token');
    if (token) {
      try {
        const response = await this.authServices.verifyToken(token);
        if (!response.error) {
          this.authServices.loginSubject(true)
          this.router.navigateByUrl('/home')
        };
      } catch (error) {
        alert(error);
      }
    }
  }
}
