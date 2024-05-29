import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css',
})
export class RegisterFormComponent {
  router = inject(Router);
  usersServices = inject(UsersService);
  authServices = inject(AuthService)

  inputForm: FormGroup;

  arrInternationalCodes: Array<any> = [];

  usernameExists: { exists: boolean } = { exists: false };

  constructor() {
    this.inputForm = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^\b[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})*$/),
        ]),
        last_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^\b[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})*$/),
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
      [this.passwordControl]
    );
  }
  /**
   *  Método que obtiene los datos del form y los envía al servicio.
   *  Verifica si
   */
  async getDataForm(): Promise<void> {
    const newUser = {
      mail: this.inputForm.value.email,
      username: this.inputForm.value.username,
      password: this.inputForm.value.password,
      firstname: this.inputForm.value.first_name,
      lastname: this.inputForm.value.last_name,
      phone: `${this.inputForm.value.country_code} ${this.inputForm.value.telephone}`,
    };

    try {
      const response = await this.usersServices.createNewUser(newUser);
      if (!response.token) {
        // Verifica si se recibe error de email duplicado en BBDD
        if (response.errno === 1062) {
          const redirect = confirm(
            `El email ${this.inputForm.value.email} ya existe en base de datos.\n¿Quieres ir a la página de login?`
          );
          if (redirect) this.router.navigateByUrl('/login');
        } else {
          alert(response.message);
        }
      } else {
        // En caso el registro sea correcto se recibe y almacena el token de login
        localStorage.setItem('token', response.token!);
        alert('Usuario creado correctamente');
        this.router.navigateByUrl('/home');
      }
    } catch (error: any) {
      alert(error.message);
    }
    // this.router.navigate (['/home']);
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


  async ngOnInit() {
    // Antes de cargar la página verifico que el usuario no tenga ya el token de login. En caso afirmativo redirecciono a /home
    const token = localStorage.getItem('login_token');
    if (token) {
      try {
        const response = await this.authServices.verifyToken(token);
        if (!response.error) this.router.navigateByUrl('/home');
      } catch (error) {
        alert(error);
      }
    }

    /**
     * Recupera los valores para los de códigos de país
     */
    this.arrInternationalCodes = this.usersServices.getAllInternationalCodes();
  }

  /**
   * Método que veriifica si el username tecleado existe en BBDD
   */
  async checkUsername($event: any) {
    const username = $event.target.value;
    try {
      this.usernameExists = await this.usersServices.checkUsename(username);
    } catch (error: any) {
      console.log(error.message);
    }
  }
}
