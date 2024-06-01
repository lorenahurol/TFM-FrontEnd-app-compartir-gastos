import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';

@Component({
  selector: 'app-change-pwd-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-pwd-modal.component.html',
  styleUrl: './change-pwd-modal.component.css',
})
export class ChangePwdModalComponent {
  usersServices = inject(UsersService);
  authServices = inject(AuthService);
  commonFunc = inject(CommonFunctionsService)

  passwordForm: FormGroup;

  usernameExists: { exists: boolean } = { exists: false };

  isUpdate: boolean = false;
  username: string = '';
  id: number = 0;

  constructor() {
    this.passwordForm = new FormGroup (
      {
        password: new FormControl(null, [Validators.required]),
        password_confirm: new FormControl(null, [Validators.required]),
      },
      [this.commonFunc.passwordControl]
    );
  }

  checkControl(
    formControlName: string,
    validatorName: string
  ): boolean | undefined {
    return (
      this.passwordForm.get(formControlName)?.hasError(validatorName) &&
      this.passwordForm.get(formControlName)?.touched
    );
  }


  async UpdatePassword() {
    const password = { password: this.passwordForm.value.password}
    const pwdResponse = await this.usersServices.updatePassword(password)
    if (pwdResponse.success) {
      alert("Contraseña actualizada correctamente")
    } else {
      alert ("Se ha verificado un error durante la actualización")
    }
  }
}
