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

  }
}
