import { Component, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { GroupsService } from '../../services/groups.service';
import { IRoles } from '../../interfaces/iroles.interface';

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
  

  async ngOnInit() {
    await this.groupService.getAllInfoGroupsByUser().then((data: IUserGroups[]) => {
      this.arrInfoGroups = data;
    });

    this.roles = await this.groupService.getUserRolesByGroup();

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

  }


  updateFilterTable(filter: string) {
    this.filter = filter;

    /* recargar tabla aplicando filtro */
    this.ngOnInit();

  }
}
