import { Component } from '@angular/core';
import { RegisterFormComponent } from '../../components/register-form/registerform.component';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [RegisterFormComponent],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.css',
})
export class UpdateUserComponent {}
