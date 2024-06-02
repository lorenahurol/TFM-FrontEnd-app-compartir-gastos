import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';

export const rolesGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const groupService = inject(GroupsService)
  let isGranted = false;
  let roles: IRoles | any = {};

  /* obtener groupId de los parámetros de la ruta (route) */
  const groupId: number = Number(route.params['groupId']);
  console.log('groupId', groupId);

  if (groupId === undefined) {
    alert('No se ha facilitado un grupo en la ruta');
    router.navigateByUrl('/home');
    return false;
  }

  /* VALIDACIONES DE ACCESO PARA GASTOS ('EXPENSES') */
  if (route.url[0].path.includes('expenses')) {

    roles = await groupService.getUserRolesByGroup();

    if (roles.membergroups.includes(groupId)) {
      isGranted = true;
    } else {
      alert('No tienes permisos para acceder a ver los gastos de este grupo');
      router.navigateByUrl('/home');
      return false;
    }

  }
  /* Si además intenta editar, o añadir gasto, debe ser admin */
  if (route.url.length > 2) {
    if (route.url[2].path.includes('add') || route.url[2].path.includes('edit')) {
      /* Comprobaciones de permisos para añadir o editar gasto */
      if (roles.admingroups.includes(groupId)) {
        isGranted = true;
      } else {
        alert('No tienes permisos para añadir o editar gastos de este grupo');
        router.navigateByUrl('/home');
        return false;
      }
  
    }
  } else {
    /* Comprobaciones para otras rutas */
    console.log('No es una ruta de gasto: ', route.url);
  }

  return isGranted;

};
