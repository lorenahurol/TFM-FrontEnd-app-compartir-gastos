import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-create-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-group-form.component.html',
  styleUrl: './create-group-form.component.css'
})
export class CreateGroupFormComponent {
  expenseGroupForm: FormGroup;
  // Inyectar el servicio:
  groupService = inject(GroupsService);

  // Inicializar el formulario:
  constructor() {
    this.expenseGroupForm = new FormGroup({
      title: new FormControl(null, []),
      description: new FormControl(null, []),
      category: new FormControl(null, [])
    }, [])
  }

  getDataForm(): void {
    // Insertar el grupo a traves del servicio:
    let message: string = this.groupService.insert(this.expenseGroupForm.value);
    alert(message);
    console.log(this.expenseGroupForm.value);

  }
}
