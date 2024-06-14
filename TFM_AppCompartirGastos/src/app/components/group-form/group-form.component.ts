import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GroupsService } from '../../services/groups.service';
import { Icategory } from '../../interfaces/icategory.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { IGroup } from '../../interfaces/igroup.interface';
import { AlertModalService } from '../../services/alert-modal.service';
import { AuthService } from '../../services/auth.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { HttpErrorResponse } from '@angular/common/http';

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
  adminUserId: number | null = null
  isAdmin: boolean = false;

  groupsService = inject(GroupsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  alertModalService = inject(AlertModalService);

  authService = inject(AuthService);
  commonFunc = inject(CommonFunctionsService);
  
  
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
  
async ngOnInit(): Promise<void> {
    //Obtener las categorias:
    this.arrCategories = await this.groupsService.getAllCategories();
  
  // AuthService: get current user's ID:
  const token = localStorage.getItem("token");
  if (token) {
    const tokenVerification = await this.authService.verifyToken(token);
    if (tokenVerification && tokenVerification.id) {
      this.userId = tokenVerification.id;
    }
  }

// Reutilizar el formulario para edicion:
    // Edicion/Actualizacion:
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        this.typeH2.emit("Actualiza tu");
        this.typeH3.emit("Editar");
        this.btnText = "Actualizar";
        try {
          const group = await this.groupsService.getGroupById(this.groupId);
          // Get the user ID of the group admin (creator === admin):
          this.adminUserId = group.creator_user_id;
          await this.getIsAdmin();

          this.groupFormulario.setValue({
            description: group.description,
            category: group.category_id
          })
        } catch (error) {
          console.log("No se ha encontrado el grupo", error);
        }
      
      } else {
        // Cambiar los titulos de la página:
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
        creator_user_id: this.userId, // Usuario loggeado
        active: 1 
      };

// Insertar nuevo grupo:
      if (this.btnText === "Crear") {
        
        try {
          const newGroup = await this.groupsService.addGroup(group);
          if (newGroup.id) {
            const alertModal = this.alertModalService.newAlertModal({
              icon: 'done_all',
              title: 'Perfecto!',
              body: 'Grupo creado correctamente. Está todo listo para que invites a tus amigos',
              acceptAction: true,
              backAction: false,
            });
            alertModal?.componentInstance.sendModalAccept.subscribe(
              (isAccepted) => {
                if (isAccepted) {
                  this.router.navigateByUrl(`/home/groups/${newGroup.id}/invitation`);
                }
              }
            );
  
            this.groupFormulario.reset();
          }
        } catch (error: any) {
          // Error 409: Conflict (Group already exists):
        if (error.status === 409) {
          this.alertModalService.newAlertModal({
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
      } else if (this.isAdmin) { // Solo el Admin tiene permiso para actualizar
        try {
                    
          const { description, category } = this.groupFormulario.value;

          const group: IGroup = {
            id:this.groupId,
            description: description,
            category_id: category,
            creator_user_id: this.userId, // Usuario loggeado
            active: 1 
          };

          const result = await this.groupsService.editGroup(group);
          await this.router.navigate([`home/groups/${this.groupId}`]);
          
          console.log(result);
        } catch (error) {
          console.log('Error al actualizar el grupo:', error);
        }
      } else {
        this.alertModalService.newAlertModal({
          icon: 'error',
          title: 'Error!',
          body: 'No tienes permiso para editar este grupo',
          acceptAction: true,
          backAction: false,
        });
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

   async getIsAdmin() {
    try {
      const roles = await this.groupsService.getUserRolesByGroup();

      if (roles.admingroups.includes(Number(this.groupId))) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } catch (error: HttpErrorResponse | any) {
      console.error(error);
      this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Problema al verificar rol',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }
};
