import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-group-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-members.component.html',
  styleUrl: './add-group-members.component.css'
})
export class AddGroupMembersComponent {

  inviteMembersForm: FormGroup;

  constructor() {
    this.inviteMembersForm = new FormGroup({
      email: new FormControl("", [
        // Validadores:
        Validators.required,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$") // Email válido
        // ** Comprobar que existe en BD ** //
      ]),
      message: new FormControl("", [
        Validators.maxLength(400)
      ]),
    }, [])
  }

  getDataForm(): void {
    console.log(this.inviteMembersForm.value);
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.inviteMembersForm.get(formControlName)?.hasError(validatorName) &&
      this.inviteMembersForm.get(formControlName)?.touched
    );
  }
}
