import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ChangePwdModalComponent } from '../change-pwd-modal/change-pwd-modal.component';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { AlertModalComponent, IAlertData } from '../alert-modal/alert-modal.component';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { EmailsService, IEmailData } from '../../services/emails.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs'

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, ChangePwdModalComponent, AlertModalComponent],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css',
})
export class RegisterFormComponent {
  private usernameInputSubject: Subject<string> = new Subject<string>();

  alertModalService = inject(AlertModalService);

  router = inject(Router);
  usersServices = inject(UsersService);
  authServices = inject(AuthService);
  commonFunc = inject(CommonFunctionsService);
  emailService = inject(EmailsService);

  inputForm: FormGroup;

  arrInternationalCodes: Array<any> = [];

  usernameExists: boolean = false;

  isUpdate: boolean = false;
  username: string = '';
  id: number = 0;

  constructor() {
    this.inputForm = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /^\b[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,}(?:\s+[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,})*$/u
          ),
        ]),
        last_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(
            /^\b[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,}(?:\s+[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,})*$/u
          ),
        ]),
        username: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^(?!.*\s)[a-zA-Z0-9\S]{4,}$/),
        ]),
        country_code: new FormControl(null, []),
        telephone: new FormControl(null, []),
        email: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[a-z]{2,4}$/),
        ]),
        password: new FormControl(null, [Validators.required]),
        password_confirm: new FormControl(null, [Validators.required]),
      },
      [this.commonFunc.passwordControl]
    );
  }


  async ngOnInit() {
    const currentRoute = this.router.url;
    const token = localStorage.getItem('login_token');

    // Verifica si hay token y recupera el payload
    if (token) {
      const tokenResponse = await this.commonFunc.verifyToken(token);
      // Si no es update y el token es válido, redirecciono a la home
      if (tokenResponse.success && currentRoute !== '/home/users/update') {
        const alertModal = this.alertModalService.newAlertModal({
          icon: 'notifications',
          title: 'Ya estás registrado!',
          body: 'Te llevamos a casa ',
          acceptAction: true,
          backAction: false,
        });
        alertModal?.componentInstance.sendModalAccept.subscribe(
          (isAccepted) => {
            if (isAccepted) {
              this.router.navigateByUrl('/home');
            }
          }
        );
      }

      // Si es update instancio formulario rellenado
      if (tokenResponse.success && currentRoute === '/home/users/update') {
        this.id = tokenResponse.data.id;
        this.isUpdate = true;

        const currentUser = await this.usersServices.getUserById(this.id);

        // defino a nivel global el valor de username para usarlo como discriminante en la función checkusername
        this.username = currentUser.username;

        this.inputForm = new FormGroup({
          first_name: new FormControl(currentUser.firstname, [
            Validators.required,
            Validators.pattern(
              /^\b[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,}(?:\s+[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,})*$/u
            ),
          ]),
          last_name: new FormControl(currentUser.lastname, [
            Validators.required,
            Validators.pattern(
              /^\b[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,}(?:\s+[A-Za-záéíóúÁÉÍÓÚüÜñÑçÇ]{2,})*$/u
            ),
          ]),
          username: new FormControl(currentUser.username, [
            Validators.required,
            Validators.pattern(/^(?!.*\s)[a-zA-Z0-9\S]{4,}$/),
          ]),
          country_code: new FormControl(currentUser.countryCode, []),
          telephone: new FormControl(currentUser.phone, []),
          email: new FormControl(currentUser.mail, [
            Validators.required,
            Validators.pattern(/^[\w-.]+@([\w-]+\.)+[a-z]{2,4}$/),
          ]),
        });
      }
    }
    /**
     * Recupera los valores para los de códigos de país
     */
    this.arrInternationalCodes = this.usersServices.getAllInternationalCodes();

    /** 
     * Función de debounce para reducir llamadas a ls API desde checkusername. Espera 300ms desde el ultimo evento de input y elimina las llamadas duplicadas antes de llamar a checkUsername
     */
    this.usernameInputSubject
      .pipe(
        debounceTime(300), // Espera 300 ms después del último evento de entrada
        distinctUntilChanged() // Evita llamadas duplicadas consecutivas
      )
      .subscribe((currentUsername) => {
        this.checkUsername(currentUsername);
      });
  }

  /**
   *  Método que obtiene los datos del form y los envía al servicio.
   */
  async getDataForm(): Promise<void> {
    const newUser = {
      mail: this.inputForm.value.email,
      username: this.inputForm.value.username,
      firstname: this.inputForm.value.first_name,
      lastname: this.inputForm.value.last_name,
      phone: `${this.inputForm.value.country_code} ${this.inputForm.value.telephone}`,
      password: this.inputForm.value.password,
    };

    // Petición de update de usuario
    if (this.isUpdate) {
      try {
        const response = await this.usersServices.updateUser(newUser);
        if (response.success) {
          const alertModal = this.alertModalService.newAlertModal({
            icon: 'done_all',
            title: 'Perfecto!',
            body: 'Actualización realizada correctamente ',
            acceptAction: true,
            backAction: false,
          });
          alertModal?.componentInstance.sendModalAccept.subscribe(
            (isAccepted) => {
              if (isAccepted) {
                this.router.navigateByUrl('/home');
              }
            }
          );
        } else if (response.errno === 1062) {
          // Verifica si se recibe error de email duplicado en BBDD
          this.alertModalService.newAlertModal({
            icon: 'warning',
            title: 'Atención!',
            body: `El email ${newUser.mail} ya existe en base de datos.`,
            acceptAction: false,
            backAction: true,
          });
        } else {
          this.alertModalService.newAlertModal({body: response.message});
        }
      } catch (error) {
        this.alertModalService.newAlertModal({body: error});
      }
      // Petición de registro de nuevo usuario
    } else {
      try {
        const response = await this.usersServices.createNewUser(newUser);
        if (!response.token) {
          // Verifica si se recibe error de email duplicado en BBDD
          if (response.errno === 1062) {
            const alertModal = this.alertModalService.newAlertModal({
              icon: 'warning',
              title: 'Atención!',
              body: `El email ${newUser.mail} ya existe en base de datos.\n
              ¿Quieres ir a la página de login?`,
              acceptAction: true,
              backAction: true,
            });
            alertModal?.componentInstance.sendModalAccept.subscribe(
              (isAccepted) => {
                if (isAccepted) {
                  this.router.navigateByUrl('/login');
                }
              }
            );
          } else {
            this.alertModalService.newAlertModal({body: response.message});
          }
        } else {
          // En caso el registro sea correcto se recibe y almacena el token de login
          localStorage.setItem('login_token', response.token!);

          // Envío email de confirmación
          const to: string = newUser.mail;
          const firstname: string = newUser.firstname;

          const emailData: IEmailData = {
            to: to,
            name: firstname,
            selectedTemplate: 'welcome',
          };

          await this.emailService.sendEmail(emailData);

          // instancio mensaje de confirmación de registro y llevo a home
          const alertModal = this.alertModalService.newAlertModal({
            icon: 'done_all',
            title: 'Perfecto!',
            body: `Usuario creado.\n
            Te llevamos a tu nueva casa.`,
            acceptAction: true,
            backAction: false,
          });
          alertModal?.componentInstance.sendModalAccept.subscribe(
            (isAccepted) => {
              if (isAccepted) {
                this.router.navigateByUrl('/home');
              }
            }
          );
        }
      } catch (error: any) {
        this.alertModalService.newAlertModal({body: error.message});
      }
    }
  }

  /**
   * Método para la comprobación de todos los validadores
   */
  checkControl(
    formControlName: string,
    validatorName: string
  ): boolean | undefined {
    return (
      this.inputForm.get(formControlName)?.hasError(validatorName) &&
      this.inputForm.get(formControlName)?.touched
    );
  }

  /**
   * Método que llama al debounce para las llamadas a checkUsername
   */
  onUsernameInput(event: any) {
    const currentUsername = event.target.value;
    this.usernameInputSubject.next(currentUsername);
  }

  /**
   * Método que veriifica si el username tecleado existe en BBDD
   */
  async checkUsername(currentUsername: any) {
    this.usernameExists = await this.commonFunc.checkUsername(
      this.username,
      currentUsername
    );
  }
}
