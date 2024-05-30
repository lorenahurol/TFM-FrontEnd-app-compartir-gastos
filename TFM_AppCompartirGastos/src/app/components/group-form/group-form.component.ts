import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';
import { Icategory } from '../../interfaces/icategory.interface';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent {
  btnText: string = "Crear";
  arrCategories: Icategory[] = [];
  groupFormulario: FormGroup;
  groupId: number | null = null;
  groupsService = inject(GroupsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  
  // Inicializar el formulario:
  constructor() {
    this.groupFormulario = new FormGroup({
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

  // Reutilizar el formulario para edicion:
  ngOnInit() {
    // Obtener las categorias:
    // this.arrCategories = this.groupsService.getAllCategories();

    // Edicion/Actualizacion:
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        this.btnText = "Actualizar";
        try {
          const group = await this.groupsService.getGroupById(params.groupId);
          this.groupFormulario.setValue({
            group_name: group.name,
            description: group.description,
            category: group.category_id
          })
        } catch (error) {
          console.log(error);
        }
      }
    })

  }

  // Trabajar con los datos del formulario:
  getDataForm(): void {
    if (this.groupFormulario.valid) {
      if (this.btnText === "Crear") {
        // Insertar nuevo grupo:
        try {
          const result = this.groupsService.addGroup(this.groupFormulario.value);
          this.groupFormulario.reset();
          this.router.navigate(['/groups']);
          console.log(result)
        } catch (error) {
          console.error(error);
        }
    
      } else {
        try {
          // Editar el grupo:
          const result = this.groupsService.editGroup(this.groupFormulario.value);
          this.router.navigate([`home/groups/${this.groupId}`]);
          console.log(result);
        } catch (error) {
          console.error(error);
        }
      }
    }
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.groupFormulario.get(formControlName)?.hasError(validatorName) &&
      this.groupFormulario.get(formControlName)?.touched
    )
  }
};
