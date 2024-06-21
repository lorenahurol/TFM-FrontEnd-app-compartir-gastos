import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { CommonFunctionsService } from '../../services/common-functions.service';
import { AlertModalService } from '../../services/alert-modal.service';

@Component({
  selector: 'app-change-pwd-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './change-pwd-modal.component.html',
  styleUrl: './change-pwd-modal.component.css',
})
export class ChangePwdModalComponent {
  alertModalService = inject(AlertModalService);

  usersServices = inject(UsersService);
  authServices = inject(AuthService);
  commonFunc = inject(CommonFunctionsService);

  passwordForm: FormGroup;

  usernameExists: { exists: boolean } = { exists: false };

  isUpdate: boolean = false;
  username: string = '';
  id: number = 0;

  constructor() {
    this.passwordForm = new FormGroup(
      {
        password: new FormControl(null, [Validators.required]),
        password_confirm: new FormControl(null, [Validators.required],),
      }, { validators: this.commonFunc.passwordControl }
    );
  }

  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.passwordForm.get(formControlName)?.hasError(validatorName) &&
      this.passwordForm.get(formControlName)?.touched
    );
  }

  async UpdatePassword() {
    if (this.passwordForm.valid) {
    const password = { password: this.passwordForm.value.password };
    const pwdResponse = await this.usersServices.updatePassword(password);
      
      if (pwdResponse.success) {
        this.alertModalService.newAlertModal({
          icon: 'done_all',
          title: 'Genial!',
          body: 'Contraseña actualizada correctamente ',
          acceptAction: true,
          backAction: false,
        });

      } else {
        this.alertModalService.newAlertModal({
          icon: 'warning',
          title: 'Atención!',
          body: 'Error durante la actualización',
          acceptAction: true,
          backAction: false,
        });
      }
    }
  }

  clearText()
  {
    this.passwordForm.get('password')?.setValue("");
    this.passwordForm.get('password_confirm')?.setValue("");
  }

  
}