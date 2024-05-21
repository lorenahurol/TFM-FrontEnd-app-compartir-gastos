import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-registerform',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './registerform.component.html',
  styleUrl: './registerform.component.css'
})
export class RegisterFormComponent {

  inputForm : FormGroup

  constructor() {
    this.inputForm = new FormGroup({
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[[:alpha:]]$/),
      ]),
      surname: new FormControl(null, [
        Validators.required,
        Validators.minLength(2),
        Validators.pattern(/^[[:alpha:]]|([[:alpha:]]+\s+[[:alpha:]])$/),
      ]),
      username: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern(/^[[:word:]]$/),
      ]),
      country_code: new FormControl(null, [Validators.required]),
      telephone: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^[[:digit:]]$/),
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
      ]),
    });
  }

  getDataForm(): void {
    
  
  }
}
