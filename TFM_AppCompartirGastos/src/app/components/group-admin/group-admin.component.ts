import { Component, Input, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatIconModule } from '@angular/material/icon';
import { IExpense } from '../../interfaces/iexpense.interface';
import { ExpensesService } from '../../services/expenses.service';
import { IGroup } from '../../interfaces/igroup.interface';

@Component({
  selector: 'app-group-admin',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './group-admin.component.html',
  styleUrl: './group-admin.component.css'
})
export class GroupAdminComponent {
  @Input() infoGroup!: IUserGroups;

  activatedRoute = inject(ActivatedRoute);
  arrUsers: IUser[] = [];
  userService = inject(UsersService);
  groupService = inject(GroupsService);
  alertModalService = inject(AlertModalService);
  router =  inject(Router);
  groupId: string = '';
  isAdmin: boolean = false;

  arrExpenses: IExpense[] = [];
  expenseService = inject(ExpensesService);

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
        try {
          this.getIsAdmin();
          this.arrUsers = await this.userService.getUsersByGroup(params.groupId);
        } catch (error) {
          console.error(error);
        }
      }
    });
  }

  async getIsAdmin() {
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
        title: 'Problema al comprobar el rol de administrador',
        body: `Se produjo el siguiente problema: ${error.error.error}`,
        acceptAction: true,
        backAction: false,
      });
    }
  }

  editUser(member: IUser) {
    this.router.navigate([`/home/members/${this.groupId}/${member.id}`]);
  }

  async deleteUser(member: IUser) {
    const expensesUser: Array<IExpense> = await this.expenseService.getExpensesByGroup(Number(this.groupId));

    const group: IGroup = await this.groupService.getGroupById(Number(this.groupId));
    if(expensesUser.filter(e => e.payer_user_id == member.id && e.active == 1).length > 0)
    {
      this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Problema al eliminar',
        body: `No se puede eliminar el usuario del grupo por que tiene gastos activos asignados`,
        acceptAction: true,
        backAction: false,
      });

    } else if(member.id == group.creator_user_id)
      {
        this.alertModalService.newAlertModal({
          icon: 'notifications',
          title: 'Problema al eliminar',
          body: `No se puede eliminar el usuario porque es el adminastrador del grupo`,
          acceptAction: true,
          backAction: false,
        });
      }else{

      //Model de confirmacion
      const alertModal = this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Eliminar miembro',
        body: `Esta seguro que desea eliminar el usuario del grupo`,
        acceptAction: true,
        backAction: true,
      });

      //Si acepta se procede al borrado
      alertModal?.componentInstance.sendModalAccept.subscribe(
        async (isAccepted) => {
          if (isAccepted) {
            this.userService.deleteMember(Number(this.groupId), member.id);
            const alertModal2 = this.alertModalService.newAlertModal({
              icon: 'notifications',
              title: 'Miembro eliminado',
              body: `Se ha eliminado correctamente al usuario del grupo`,
              acceptAction: true,
              backAction: false,
            });
            
            alertModal2?.componentInstance.sendModalAccept.subscribe(
              async (isAccepted) => {
                if (isAccepted) { 
                  //Se recargan los datos
                  this.userService.getUsersByGroup(Number(this.groupId)).then(users => {
                    this.arrUsers = users;
                  });
                }
              })
          }
        }
      );

    }
  }

  async deleteGroup() {
    const expensesGroup: Array<IExpense> = await this.expenseService.getExpensesByGroup(Number(this.groupId));

    const group: IGroup = await this.groupService.getGroupById(Number(this.groupId));
    if(expensesGroup.length > 0) {
      this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Problema al eliminar',
        body: `No se puede eliminar el grupo por que tiene gastos activos asignados`,
        acceptAction: true,
        backAction: false,
      });
    } else {

      //Model de confirmacion
      const alertModal =this.alertModalService.newAlertModal({
        icon: 'notifications',
        title: 'Eliminar grupo',
        body: `Esta seguro que desea eliminar el grupo`,
        acceptAction: true,
        backAction: true,
      });

      //Si acepta se procede al borrado
      alertModal?.componentInstance.sendModalAccept.subscribe(
        (isAccepted) => {
          if (isAccepted) {
            //eliminar grupo
            this.groupService.deleteGroup(group);

            this.alertModalService.newAlertModal({
              icon: 'notifications',
              title: 'Grupo eliminado',
              body: `Se ha eliminado correctamente el grupo`,
              acceptAction: true,
              backAction: false,
            });

            this.router.navigate([`/home/`]);
            
          }
        }
      )
    };
  }

}
