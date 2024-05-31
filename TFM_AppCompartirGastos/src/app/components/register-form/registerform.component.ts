import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
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
  authServices = inject(AuthService);
  activatedRoute = inject(ActivatedRoute);

  inputForm: FormGroup;

  arrInternationalCodes: Array<any> = [];

  usernameExists: { exists: boolean } = { exists: false };

  isUpdate: boolean = false;
  username: string = '';
  id: number = 0

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

  async ngOnInit() {
    const currentRoute = this.router.url;
    const token = localStorage.getItem('login_token');

    // Verifica si hay token y recupera el payload
    if (token) {
      const tokenResponse = await this.verifyToken(token);
      // Si no es update y el token es válido, redirecciono a la home
      if (tokenResponse.success && currentRoute !== '/home/users/update') {
        alert('Ya estás registrado! \nTe llevamos a casa');
        this.router.navigateByUrl('/home');
      }

      // Si es update instancio formulario rellenado
      if (tokenResponse.success && currentRoute === '/home/users/update') {
        this.id = tokenResponse.data.id;
        this.isUpdate = true

        const currentUser = await this.usersServices.getUserById(this.id);

        // defino a nivel global el valor de username para usarlo como discriminante en la función checkusername
        this.username = currentUser.username;

        this.inputForm = new FormGroup(
          {
            first_name: new FormControl(currentUser.firstname, [
              Validators.required,
              Validators.pattern(/^\b[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})*$/),
            ]),
            last_name: new FormControl(currentUser.lastname, [
              Validators.required,
              Validators.pattern(/^\b[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})*$/),
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
            password: new FormControl(currentUser.password, [
              Validators.required,
            ]),
            password_confirm: new FormControl(currentUser.password, [
              Validators.required,
            ]),
          },
          [this.passwordControl]
        );
      }
    }
    /**
     * Recupera los valores para los de códigos de país
     */
    this.arrInternationalCodes = this.usersServices.getAllInternationalCodes();
  }

  /**
   *  Método que obtiene los datos del form y los envía al servicio.
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

    // Petición de update de usuario
    if (this.isUpdate) {
      try {
        const response = await this.usersServices.updateUser(this.id, newUser)
        if (response.success) {
          alert("Actualización realizada correctamente")
          this.router.navigateByUrl('/home')
        } else if (response.errno === 1062) {
          // Verifica si se recibe error de email duplicado en BBDD
          alert(`El email ${this.inputForm.value.email} ya existe en base de datos.`);
        } else {
          alert (response.message)
        }
        } catch (error) {
          alert (error)
      }
    // Petición de registro de nuevo usuario
    } else {
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
          localStorage.setItem('login_token', response.token!);
          alert('Usuario creado correctamente');
          this.router.navigateByUrl('/home');
        }
      } catch (error: any) {
        alert(error.message);
      }
      // this.router.navigate (['/home']);
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
  async checkUsername($event: any) {
    const currentUsername = $event.target.value;
    if (this.username !== currentUsername) {
      try {
        this.usernameExists = await this.usersServices.checkUsename(
          currentUsername
        );
      } catch (error: any) {
        console.log(error.message);
      }
    }
  }
}
