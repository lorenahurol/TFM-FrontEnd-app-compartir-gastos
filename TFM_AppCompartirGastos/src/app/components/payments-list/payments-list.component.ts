import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ImemberGroup } from '../../interfaces/imember-group';
import { IExpense } from '../../interfaces/iexpense.interface';
import { IUser } from '../../interfaces/iuser.interface';
import { ExpensesService } from '../../services/expenses.service';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { AlertModalService } from '../../services/alert-modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { IRoles } from '../../interfaces/iroles.interface';
import dayjs from 'dayjs';
import { EmailsService, IEmailData } from '../../services/emails.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.css'
})
export class PaymentsListComponent {
  arrExpenses: IExpense[] = [];
  arrUsers: IUser[] = [];
  groupId: number = 0;
  expenseService = inject(ExpensesService);
  userService = inject(UsersService);
  groupService = inject(GroupsService);
  activatedRoute = inject(ActivatedRoute);
  commonFunc = inject(CommonFunctionsService);
  router = inject(Router);
  emailsService = inject(EmailsService);

  // manejo de la ventana modal de borrado
  alertModalService = inject(AlertModalService);
  expenseId_a: number = -1;
  arrMembers: Array<ImemberGroup> = [];
  
  expenseId: number = -1;
  isAdmin: boolean = false;
  percentEquitable: string = "Proporcional";
  percentNoEquitable: number = -1;

  totalExpenses:any [] = []


  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = +params.groupId;
        try {
          this.getIsAdmin();
          this.arrExpenses = await this.expenseService.getExpensesByGroup(params.groupId);
          this.arrUsers = await this.userService.getUsersByGroup(params.groupId);
        } catch (error) {
          console.error(error);
        }
      }

      this.getPayments();
    });
  }


   /**
   * Metodo para calcular los pagos
   */
   async getPayments(){
    //Recupero todos los gastos del grupo agrupados por usuario
    this.totalExpenses = await this.expenseService.getExpensesGroupingByUser(Number(this.groupId));
    
    //Recupero los miembros del grupo
    const members: any[] = await this.userService.getMemberUserByGroup(Number(this.groupId));
    
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
      const foundElement = this.totalExpenses.find(element => element.payer_user_id === mb.user_id);
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
        this.percentNoEquitable += member.percent;
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
      this.percentEquitable += " (" + ((100 - this.percentNoEquitable*100) / equitableMembers.length).toFixed(2).toString().replace('.', ',') + "%)";

      for(let member of equitableMembers)
      {
        let xcredit = avegareExpenses - member.totalEx;
        totalNoEquitable += xcredit;
        member.credit = - xcredit;
      }
    }

    this.arrMembers = membersAll;
  }


  formatDate(date: Date): string {
    return dayjs(date).format('DD/MM/YYYY');
  }

  formatAmount(amount: number): string {
    let strAmount: string = amount.toFixed(2).toString();
    strAmount = strAmount.replace('.', ',');
    strAmount = strAmount.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return strAmount + ' €';
  }

  formatPercent(percent: number): string {
    let strPercent: string = this.percentEquitable;
    if(percent > 0)
      {
        strPercent = (percent * 100.0).toFixed(2).toString();
        strPercent = strPercent.replace('.', ',');
        strPercent = strPercent.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.') +  ' %';
      }
      return strPercent;
  }

  formatEquitable(equitable: boolean): string {
    let strEquitable: string = "No";
    if(equitable)
      {
        strEquitable = "Si"
      }
      return strEquitable;
  }

  getUserName(userId: number): string {
    const user: IUser | undefined = this.arrUsers.find(
      (user) => user.id === userId
    );
    return user ? user.firstname : '';
  }

  async getIsAdmin() {
    let roles: IRoles | any = {};

    try {
      const roles = await this.groupService.getUserRolesByGroup();

      if (roles.admingroups.includes(Number(this.groupId))) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    } catch (error: HttpErrorResponse | any) {
      console.error(error);
      this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Problema al eliminar gasto',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }

  async settleExpenses() {
    console.log (this.groupId)
    try {
      const response = await this.expenseService.deactivateExpenses({groupId: this.groupId})
      if (response.success) {
        const alertModal = this.alertModalService.newAlertModal({
          icon: 'done_all',
          title: 'Perfecto!',
          body: 'Todos los gastos se han saldado correctamente ',
          acceptAction: true,
          backAction: false,
          });
          alertModal?.componentInstance.sendModalAccept.subscribe(
            (isAccepted) => {
              if (isAccepted) {
                this.router.navigateByUrl(`/home`, { skipLocationChange: true }).then(() => {
                  this.router.navigate([`/home/groups/${this.groupId}`])
                })
              }
              }
            );
        this.sendEmails()
      }
      
    } catch (error) {
      this.alertModalService.newAlertModal({body: error})
    }
  }

  async sendEmails() {
    // rellena el array de destiniatarios de correo con los usuarios del grupo
    let arrBcc: number[] = []
    this.totalExpenses.forEach(user => arrBcc.push(user.payer_user_id))
    
    // recupera el nombre del grupo
    const groupData = await this.groupService.getAllInfoGroupById(this.groupId)
    const emailData: IEmailData = {
      bcc: arrBcc,
      selectedTemplate: "settleExpenses",
      groupName: groupData.description,
      balance: this.arrMembers
    }
    await this.emailsService.sendEmail (emailData)
  }
}
