import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';
import { Icategory } from '../../interfaces/icategory.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IGroup } from '../../interfaces/igroup.interface';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { AlertModalComponent, IAlertData } from '../alert-modal/alert-modal.component';

@Component({
  selector: 'app-group-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './group-form.component.html',
  styleUrl: './group-form.component.css'
})
export class GroupFormComponent {
  @Output() typeH2 = new EventEmitter<string>();
  @Output() typeH3 = new EventEmitter<string>();

  btnText: string = "Crear";
  arrCategories: Icategory[] = [];
  groupFormulario: FormGroup;
  groupId: number = 0;
  userId: number = 0;
  groupsService = inject(GroupsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  alertModalService = inject(AlertModalService);

  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;
  
  
  // Inicializar el formulario:
  constructor() {
    this.groupFormulario = new FormGroup({
      description: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      category: new FormControl("", [
        Validators.required
      ])
    }, [])
  }

  // Instancia el modal alert-modal-component para alertas
  openAlertModal(modalData: IAlertData): void {
    this.alertModal = this.alertModalService.open(modalData);
  }

  // Reutilizar el formulario para edicion:
ngOnInit(): void {
    // Obtener las categorias:
    // this.arrCategories = this.groupsService.getAllCategories();

    // Edicion/Actualizacion:
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        this.typeH2.emit("Actualiza tu");
        this.typeH3.emit("Editar");
        this.btnText = "Actualizar";
        try {
          const group = await this.groupsService.getGroupById(this.groupId);
          this.groupFormulario.setValue({
            description: group.description,
            category: group.category_id
          })
        } catch (error) {
          console.log(error);
        }  } else {
        this.typeH2.emit("Crear");
        this.typeH3.emit("Nuevo");
      }
      })

  }

  // Trabajar con los datos del formulario:
 async getDataForm(): Promise<void> {
    if (this.groupFormulario.valid) {
      const { description, category } = this.groupFormulario.value;

      const group: IGroup = {
        description: description,
        category_id: category,
        creator_user_id: this.userId,
        active: 1 
      };

// Insertar nuevo grupo:
      if (this.btnText === "Crear") {
        
        try {
        await this.groupsService.addGroup(group);
        this.openAlertModal({
          icon: 'done_all',
          title: 'Perfecto!',
          body: 'Grupo creado correctamente',
          acceptAction: true,
          backAction: false,
        });
        this.alertModal?.componentInstance.sendModalAccept.subscribe(
          (isAccepted) => {
            if (isAccepted) {
              this.router.navigateByUrl('/home');
            }
          }
        );

        this.groupFormulario.reset();
          await this.router.navigate(['/groups']);
          
        } catch (error: any) {
          // Error 409: Conflict (Group already exists):
        if (error.status === 409) {
          this.openAlertModal({
            icon: 'error',
            title: 'Error!',
            body: 'El grupo ya existe',
            acceptAction: true,
            backAction: false,
          });
        } else {
          console.log('Error al crear el grupo', error);
        }
        }
        
// Editar el grupo: btnText === "Actualizar"
      } else {
        try {
          const result = await this.groupsService.editGroup(this.groupFormulario.value);
          await this.router.navigate([`home/groups/${this.groupId}`]);
          console.log(result);
        } catch (error) {
          console.log('Error al actualizar el grupo:', error);
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
