import { Component, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';
import { Router } from '@angular/router';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { ImemberGroup } from '../../interfaces/imember-group';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css',
})
export class UserDashboardComponent {
  arrInfoGroups: IUserGroups[] = [];
  roles: IRoles | any = {};
  filter: string = 'todos';
  groupService = inject(GroupsService);
  commonFunc = inject(CommonFunctionsService);
  router = inject(Router);
  userId: number | any;
  

  async ngOnInit() {
    await this.groupService.getAllInfoGroupsByUser().then((data: IUserGroups[]) => {
      this.arrInfoGroups = data;
    });

    this.roles = await this.groupService.getUserRolesByGroup();
    this.userId = await this.commonFunc.getUserId();

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
      let pagos: ImemberGroup[] = await this.commonFunc.getPayments(infoGroup.group_id);
      /* filtrar pagos por aquel cuyo id coincide con userId */
      let pagoUsuario = pagos.filter((pago: ImemberGroup) => pago.id === this.userId);
      infoGroup.totalexpenses = pagoUsuario[0].totalEx;
      infoGroup.balance = pagoUsuario[0].credit;
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

  formatAmount(amount: number | undefined): string {
    if (amount === undefined) {
      return '';
    } else {
      amount = Math.round((amount + Number.EPSILON) * 100) / 100;
    }
    let strAmount: string = amount.toString();
    strAmount = strAmount.replace('.', ',');
    return strAmount + ' €';
  }
}
