import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-group-form.component.html',
  styleUrl: './create-group-form.component.css'
})
export class CreateGroupFormComponent {
  expenseGroupForm: FormGroup;

  // Inicializar el formulario:
  constructor() {
    this.expenseGroupForm = new FormGroup({
      title: new FormControl(null, []),
      description: new FormControl(null, []),
      category: new FormControl(null, [])
    }, [])
  }

  getDataForm() {
    console.log(this.expenseGroupForm.value);

  }
}
