import { Component, inject } from '@angular/core';
import { GroupInfoCardComponent } from '../../components/group-info-card/group-info-card.component';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { ActivatedRoute, RouterLink, RouterOutlet } from '@angular/router';
import { GroupsService } from '../../services/groups.service';
import { UsersService } from '../../services/users.service';
import { CommonFunctionsService } from '../../common/utils/common-functions.service';
import { IUser } from '../../interfaces/iuser.interface';
import { ExpensesService } from '../../services/expenses.service';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ImemberGroup } from '../../interfaces/imember-group';
import { ExpenseListComponent } from '../expense-list/expense-list.component';
import { PaymentsListComponent } from '../../components/payments-list/payments-list.component';
import { GroupAdminComponent } from '../../components/group-admin/group-admin.component';
import { MessengerComponent } from '../../components/messenger/messenger.component';


@Component({
  selector: 'app-group-dashboard',
  standalone: true,
  imports: [GroupInfoCardComponent, GroupAdminComponent, ExpenseListComponent, PaymentsListComponent,RouterOutlet, RouterLink, MessengerComponent],
  templateUrl: './group-dashboard.component.html',
  styleUrl: './group-dashboard.component.css',
})
export class GroupDashboardComponent {
  activatedRoute = inject(ActivatedRoute);
  groupService = inject(GroupsService);
  userService = inject(UsersService);
  expensesService = inject(ExpensesService);
  commonFunc = inject(CommonFunctionsService);
  group: IUserGroups | any;
  groupId: string = '';
  user: IUser | any;
  userId: number | any;
  activeTab: string = 'expenses'; // Pesaña activa. Puede tomar los valores 'expenses', 'payments', 'admin', 'messages'

  async ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        try {   
          this.group = await this.groupService.getAllInfoGroupById(Number(this.groupId));
          this.userId = await this.commonFunc.getUserId();
          this.user = await this.userService.getUserById(this.userId);
          
          // obtener gastos del grupo
          let expenses:IExpense[] = await this.expensesService.getExpensesByGroup(this.group.group_id);

          if (expenses.length > 0) {
            this.group.thereAreExpenses = true;
            /* si existen, obtener pagos del grupo */
            let pagos: ImemberGroup[] = await this.commonFunc.getPayments(this.group.group_id);
            /* filtrar pagos por aquel cuyo id coincide con userId */
            let pagoUsuario = pagos.filter((pago: ImemberGroup) => pago.user_id === this.userId);
            this.group.totalexpenses = pagoUsuario[0].totalEx;
            this.group.balance = pagoUsuario[0].credit;
          } else {
            this.group.thereAreExpenses = false;
          }

        } catch (error) {
          console.error(error);
        }
      }
    });
    this.activeTab = localStorage.getItem('activeTab') || 'expenses';
  }

  async changeTab(tab: string) {
    this.activeTab = tab;
    localStorage.setItem('activeTab', tab);
  }

  async getClassTab(tab: string) {
    return this.activeTab === tab ? 'nav-link active' : 'nav-link';
  }

  getGroup(): number {
    return Number(this.groupId);
  }
}
