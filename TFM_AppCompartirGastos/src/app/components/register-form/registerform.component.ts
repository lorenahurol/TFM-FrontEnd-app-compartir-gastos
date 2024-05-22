import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css',
})
export class RegisterFormComponent {

  inputForm: FormGroup;

  usersService = inject(UsersService)
  arrInternationalCodes: Array<any> = []
  user: IUser|any

  constructor() {
    this.inputForm = new FormGroup(
      {
        first_name: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^\b[A-Za-z]{2,}(?:\s+[A-Za-z]{2,})*$/),
        ]),
        surname: new FormControl(null, [
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

  getDataForm(): void {
    console.log(this.inputForm.value);
    this.user = this.inputForm.value

  }

  // Función para la comprobación de todos los validadores
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.inputForm.get(formControlName)?.hasError(validatorName) &&
      this.inputForm.get(formControlName)?.touched
    );
  }

  // Función para verificar que las las dos contraseñas coinciden
  passwordControl(formValue: AbstractControl) : {passwordControl: boolean}|null {
    const password = formValue.get('password')?.value;
    const passwordConfirm = formValue.get('password_confirm')?.value;

    if (
      password !== passwordConfirm
    ) {
      return { passwordControl: true };
    } else {
      return null;
    }
  }


  ngOnInit() {
    // Recupera los valores para losta de códigos de país
    this.arrInternationalCodes = this.usersService.getAllInternationalCodes()
    
  }



}
