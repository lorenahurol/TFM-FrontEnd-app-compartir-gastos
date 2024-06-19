import { Injectable, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { AlertModalComponent } from '../../components/alert-modal/alert-modal.component';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatDialogRef } from '@angular/material/dialog';
import { ImemberGroup } from '../../interfaces/imember-group';
import { ExpensesService } from '../../services/expenses.service';
import { ITokenVerification } from '../../interfaces/itoken-verification.interface';

@Injectable({
  providedIn: 'root',
})
export class CommonFunctionsService {
  authServices = inject(AuthService);
  usersService = inject (UsersService);
  expensesService = inject(ExpensesService);
  alertModalService = inject(AlertModalService);
  alertModal: MatDialogRef<AlertModalComponent, any> | undefined;

  constructor() {}

  /**
   * Método para verificar que las las dos contraseñas coinciden
   */
  passwordControl(
    formValue: AbstractControl
  ): { passwordControl: boolean } | null {
    const password = formValue.get('password')?.value;
    const passwordConfirm = formValue.get('password_confirm')?.value;

    if (password !== passwordConfirm) {
      return { passwordControl: true };
    } else {
      return null;
    }
  }

  /**
   * Método para verificar si el token de localStorage es válido
   * @returns una promesa que se resuelve con un ojeto contenente el payload del token o un error
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const tokenResponse = await this.authServices.verifyToken(token);
      return { success: true, data: tokenResponse };
    } catch (error) {
      alert(error);
      return { success: false, error: error };
    }
  }

  /**
   * Método que veriifica si el username tecleado existe en BBDD
   */
  async checkUsername(username: string, currentUsername: any) {
    if (username !== currentUsername) {
      try {
        const usernameExists = await this.usersService.checkUsename(
          currentUsername
        );
        return usernameExists.exists;
      } catch (error: any) {
        return false;
      }
    }
    return false;
  }

  /**
     * Metodo para calcular los pagos de un grupo
     */
  async getPayments(groupId: number): Promise<ImemberGroup[]> {
    //Recupero todos los gastos del grupo agrupados por usuario
    const totalExpenses:any [] = await this.expensesService.getExpensesGroupingByUser(Number(groupId));
    
    //Recupero los miembros del grupo
    const members: any[] = await this.usersService.getMemberUserByGroup(Number(groupId));

    const membersAll: Array<ImemberGroup> = [];

    /* Recorro el array de miembros y busca en el array de gastos por pagador para cruzarlos
    y montar un nuevo array con toda informarcion, usando la interface IMenber-group
    calculo el gasto total del grupo y el numero de usuarios en el grupo.
    */

    let totalE: number = 0;
    for(let mb of members)
    {
      let member : ImemberGroup;
      member = {
        user_id: mb.user_id,
        group_id: mb.group_id,
        totalEx: 0,
        percent: mb.percent,
        equitable: true,
        credit: 0
      }

      if(mb.equitable == 0)
      {
          member.equitable = false;
      }
      const foundElement = totalExpenses.find(element => element.payer_user_id === mb.user_id);
      if(foundElement)
      {
        member.totalEx = foundElement.total_expenses;
      }

      membersAll.push(member);
      totalE += member.totalEx;
    }

    //Calculo los que tienen un porcentaje especifico y no comparten a partes iguales
    const noEquitableMembers : Array<ImemberGroup> = membersAll.filter(m => m.equitable === false);
    let totalNoEquitable: number = 0;
    if(noEquitableMembers.length > 0)
    {
      
      for(let member of noEquitableMembers)
      {
        let xcredit = (member.percent * totalE) - member.totalEx;
        totalNoEquitable += xcredit;
        member.credit = - xcredit;
      }
    }

    //Calculo los que tienen un porcentaje 0 y comparten a partes iguales
    const equitableMembers : Array<ImemberGroup> = membersAll.filter(m => m.equitable === true);

    if(equitableMembers.length > 0)
    {
      let avegareExpenses: number = (totalE - totalNoEquitable) / equitableMembers.length ;

      for(let member of equitableMembers)
      {
        let xcredit = avegareExpenses - member.totalEx;
        totalNoEquitable += xcredit;
        member.credit = - xcredit;
      }
    }

    return membersAll;
  }

  /**
   * Método para el id_usuario logueado
   */
  async getUserId(): Promise<number | undefined> {
    // AuthService: get current user's ID:
    const token: string | any = localStorage.getItem("login_token");
    if (token) {
      const tokenVerification: ITokenVerification = await this.authServices.verifyToken(token);
      if (tokenVerification && tokenVerification.id) {
        return tokenVerification.id;
      }
    }
    return undefined; // Add a return statement at the end of the function
  }
  
}
