import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';

@Component({
  selector: 'app-create-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-group-form.component.html',
  styleUrl: './create-group-form.component.css'
})
export class CreateGroupFormComponent {

  createGroupForm: FormGroup;
  // Inyectar el servicio:
  groupService = inject(GroupsService);

  // Array de Categorias:
  arrCategories: Array<object> = [];

  // Inicializar el formulario:
  constructor() {
    this.createGroupForm = new FormGroup({
      group_name: new FormControl("", [
        // Validadores:
        Validators.required,
        Validators.minLength(3)
      ]),
      description: new FormControl("", []),
      category: new FormControl("", [
        Validators.required
      ])
    }, [])
  }

  // Trabajar con los datos del formulario:
  getDataForm(): void {
    // Insertar el grupo a traves del servicio:
    let message: string = this.groupService.insert(this.createGroupForm.value);
    alert(message);
    console.log(this.createGroupForm.value);
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.createGroupForm.get(formControlName)?.hasError(validatorName) &&
      this.createGroupForm.get(formControlName)?.touched
    )
  }

  // Recuperar Categorias:
  ngOnInit() {
    this.arrCategories = this.groupService.getAllCategories();
  }
}
