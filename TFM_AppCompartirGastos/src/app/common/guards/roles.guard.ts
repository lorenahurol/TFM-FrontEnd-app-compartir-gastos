import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';
import { AlertModalService } from '../../services/alert-modal.service';

export const rolesGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const groupService = inject(GroupsService);
  const alertModalService = inject (AlertModalService)
  let roles: IRoles | any = {};
  let isGranted: boolean = false;
  let message: string = '';
  let redirectTo: string = '';


  /* obtener groupId de los parámetros de la ruta (route) */
  const groupId: number = Number(route.params['groupId']);

  if (groupId === undefined) {
    message = 'No se ha facilitado un grupo en la ruta';
    redirectTo = '/home';
    isGranted = false;
  }

  /* VALIDACIONES DE ACCESO PARA LAS RUTAS DE GASTOS ('expenses') */
  if (route.url[0].path.includes('expenses')) {

    roles = await groupService.getUserRolesByGroup();

    if (roles.membergroups.includes(groupId)) {
      isGranted = true;
    } else {
      message = 'No tienes permisos para acceder a ver los gastos de este grupo';
      redirectTo = '/home';
      isGranted = false;
    }

    /* Si además intenta editar, o añadir gasto, debe ser admin */
    if (route.url.length > 2) {
      if (route.url[2].path.includes('add') || route.url[2].path.includes('edit')) {
        /* Comprobaciones de permisos para añadir o editar gasto */
        if (roles.admingroups.includes(groupId)) {
          isGranted = true;
        } else {
          message = 'No tienes permisos para añadir o editar gastos de este grupo';
          redirectTo = '/home/expenses/' + groupId;
          isGranted = false;
        }
    
      }
    }
    /* VALIDACIONES DE ACCESO PARA LAS RUTAS DE GRUPOS ('groups') */
  } else if (route.url[0].path.includes('groups')) {
  
    roles = await groupService.getUserRolesByGroup();

    if (roles.membergroups.includes(groupId)) {
      isGranted = true;
      /* Comprobaciones para por si además está intentando crear invitaciones */
      if (route.url.length > 2 && route.url[2].path === "invitation") {
        if (roles.admingroups.includes(groupId)) {
          isGranted = true;
        } else {
          // Si el usuario no es admin del grupo, no puede crear invitaciones
          message = 'No tienes permisos para crear invitaciones de este grupo';
          redirectTo = '/home'
          isGranted = false;
        }
      } 
    }
    else {
      // Si el usuario no es miembro del grupo, no puede ver la información del grupo
      message = 'No tienes permisos para ver información de este grupo';
      redirectTo = '/home'
      isGranted = false;
    }
    /* VALIDACIONES DE ACCESO PARA LAS RUTAS AL FORO ('messages') */
  } else if (route.url[0].path.includes('messages')) {
    roles = await groupService.getUserRolesByGroup();
    if (roles.membergroups.includes(groupId)) {
      isGranted = true;
    } else {
      message = 'No tienes permisos para acceder a los mensajes de este grupo';
      redirectTo = '/home';
      isGranted = false;
    }
    /* VALIDACIONES DE ACCESO PARA LA RUTAS DE EDICIÓN DE GRUPO ('groupform') */
  } else if (route.url[0].path.includes('groupform')) {
    roles = await groupService.getUserRolesByGroup();

    if (roles.membergroups.includes(groupId)) 
    {
      isGranted = true;
    } 
  } else {
    // Si pasa por aquí, la ruta no es conocida para este GUARD
    message = 'Está intentando acceder a una ruta desconocida';
    redirectTo = '/home'
    isGranted = false;
  }

  if (!isGranted) {
    alertModalService.newAlertModal({
      icon: 'notifications',
      title: 'Acceso no permitido',
      body: `${message}`,
      acceptAction: true,
      backAction: false,
    });
    router.navigateByUrl(redirectTo);
  }

  return isGranted;

};


