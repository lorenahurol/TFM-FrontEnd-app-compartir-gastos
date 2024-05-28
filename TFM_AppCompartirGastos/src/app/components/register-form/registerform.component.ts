import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css',
})
export class RegisterFormComponent {
  router = inject (Router)
  usersServices = inject(UsersService);
  
  inputForm: FormGroup;

  arrInternationalCodes: Array<any> = [];

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
          Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
        ]),
        password: new FormControl(null, [Validators.required]),
        password_confirm: new FormControl(null, [Validators.required]),
      },
      [this.passwordControl]
    );
  }

  // Función que obtiene los datos del form y los envía al servicio
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
    const response = await this.usersServices.createNewUser(newUser)
    console.log (response)
    if (!response.token) { 
      alert(response.message)
    } else {
      localStorage.setItem('token', response.token!)
      alert("Usuario creado correctamente")
      this.router.navigateByUrl('/home')
    }  
  } catch (error: any) {
    alert (error.message)
  }
    // this.router.navigate (['/home']);
  }

  // Función para la comprobación de todos los validadores
  checkControl(
    formControlName: string,
    validatorName: string
  ): boolean | undefined {
    return (
      this.inputForm.get(formControlName)?.hasError(validatorName) &&
      this.inputForm.get(formControlName)?.touched
    );
  }

  // Función para verificar que las las dos contraseñas coinciden
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

  ngOnInit() {
    // Recupera los valores para los de códigos de país
    this.arrInternationalCodes = this.usersServices.getAllInternationalCodes();
  }
}
