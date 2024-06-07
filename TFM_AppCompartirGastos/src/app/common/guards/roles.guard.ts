import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';
import { CommonFunctionsService } from '../utils/common-functions.service';

export const rolesGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const groupService = inject(GroupsService);
  const commonFunc = inject(CommonFunctionsService);
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

  /* VALIDACIONES DE ACCESO PARA GASTOS ('EXPENSES') */
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
  } else if (route.url[0].path.includes('groups')) {
    /* Comprobaciones para rutas de grupos */

    roles = await groupService.getUserRolesByGroup();

    if (roles.membergroups.includes(groupId)) {
      isGranted = true;
    } else {
      message = 'No tienes permisos para acceder a la información de este grupo';
      redirectTo = '/home';
      isGranted = false;
    }
    
  } else {
    console.log('No es una ruta conocida por el guard de roles: ', route.url);
  }

  if (!isGranted) {
    commonFunc.openDialog({
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


