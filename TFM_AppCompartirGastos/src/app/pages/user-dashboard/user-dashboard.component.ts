import { Component, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';
import { Router, RouterLink } from '@angular/router';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { ImemberGroup } from '../../interfaces/imember-group';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense } from '../../interfaces/iexpense.interface';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { GroupInfoCardComponent } from '../../components/group-info-card/group-info-card.component';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [GroupInfoCardComponent, RouterLink],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  arrInfoGroups: IUserGroups[] = [];
  roles: IRoles | any = {};
  filter: string = 'todos';
  groupService = inject(GroupsService);
  userService = inject(UsersService);
  expensesService = inject(ExpensesService);
  commonFunc = inject(CommonFunctionsService);
  router = inject(Router);
  user: IUser | any;
  userId: number | any;
  

  async ngOnInit() {
    await this.groupService.getAllInfoGroupsByUser().then((data: IUserGroups[]) => {
      this.arrInfoGroups = data;
    });

    this.roles = await this.groupService.getUserRolesByGroup();
    this.userId = await this.commonFunc.getUserId();
    this.user = await this.userService.getUserById(this.userId);

    /* recorrer arrInfoGroups y añadimos isAdmin a true si el group_id está en this.roles.admingroups */
    this.arrInfoGroups.forEach((group: IUserGroups) => {
      group.is_admin = this.roles.admingroups.includes(group.group_id);
    });

    /* aplicamos el filtro */
    if (this.filter === 'admin') {
      this.arrInfoGroups = this.arrInfoGroups.filter((group: IUserGroups) => group.is_admin === true);
    } else if (this.filter === 'member') {
      this.arrInfoGroups = this.arrInfoGroups.filter((group: IUserGroups) => group.is_admin !== true);
    }

    for (let infoGroup of this.arrInfoGroups) {
      /* Comprobar si existen gastos en el grupo */
      let expenses:IExpense[] = await this.expensesService.getExpensesByGroup(infoGroup.group_id);

      if (expenses.length > 0) {
        infoGroup.thereAreExpenses = true;
        /* si existen, obtener pagos del grupo */
        let pagos: ImemberGroup[] = await this.commonFunc.getPayments(infoGroup.group_id);
        /* filtrar pagos por aquel cuyo id coincide con userId */
        let pagoUsuario = pagos.filter((pago: ImemberGroup) => pago.user_id === this.userId);
        infoGroup.totalexpenses = pagoUsuario[0].totalEx;
        infoGroup.balance = pagoUsuario[0].credit;
      } else {
        infoGroup.thereAreExpenses = false;
      }
    }

  }


  updateFilterTable(filter: string) {
    this.filter = filter;
    /* recargar tabla aplicando filtro */
    this.ngOnInit();
  }

  goToGroup(group_id: number) {
    console.log('ir a grupo', group_id);
    this.router.navigate([`/home/groups/${group_id}`]);
  }

}
