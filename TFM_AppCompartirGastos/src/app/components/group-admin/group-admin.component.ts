import { Component, Input, inject } from '@angular/core';
import { IUserGroups } from '../../interfaces/iuser-groups.interface';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { GroupsService } from '../../services/groups.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertModalService } from '../../services/alert-modal.service';
import { MatIconModule } from '@angular/material/icon';

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
  groupId: string = '';
  isAdmin: boolean = false;

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

  editUser()
  {

  }

  deleteUser(){

  }
}
