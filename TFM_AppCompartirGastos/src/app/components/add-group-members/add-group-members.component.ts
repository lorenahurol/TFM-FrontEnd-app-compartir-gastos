import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationsService } from '../../services/invitations.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IInvitation } from '../../interfaces/iinvitation.interface';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-add-group-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-members.component.html',
  styleUrl: './add-group-members.component.css'
})
export class AddGroupMembersComponent {

  invitationForm: FormGroup;
  HttpClient = inject(HttpClient);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  invitationsService = inject(InvitationsService);
  usersService = inject(UsersService);
  groupId: number | null = null;
  userId: number | null = null;
  username: string = "";

  constructor() {
    this.invitationForm = new FormGroup({
      username: new FormControl("", [
        // Validadores:
        Validators.required
      ]),
      message: new FormControl("", [
        Validators.maxLength(400)
      ]),
    }, [])
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params['groupId']) {
        this.groupId = parseInt(params['groupId']);
      }
    })
  }

  async getDataForm(): Promise<void> {
    if (this.invitationForm.valid) {
      const { username } = this.invitationForm.value;
      try {
        const user = await this.invitationsService.getUserFromUsername(username);
        console.log(user);

        const invitation: IInvitation = {
          group_id: this.groupId!,
          user_id: user.id,
          accepted: 0,
          active: 1
        }

        const result = await this.invitationsService.createInvitation(invitation);
        console.log("Invitation created:", result);
      }
      catch (error) {
        console.error('Error creating invitation:', error);
      }
    }
  }

  /*
  async getUsername(): Promise<void> {
  const username = this.invitationForm.value['username'];
  if (username) {
    try {
      const user = await this.invitationsService.getUserFromUsername(username);
      if (user) {
        const user = await this.usersService.getUserById(user.id);
        this.username = user.username;
      } else {
        console.error('User not found with the given username');
      }
    } catch (error) {
      console.error('Error getting username:', error);
    } 
  } 
} */



  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.invitationForm.get(formControlName)?.hasError(validatorName) &&
      this.invitationForm.get(formControlName)?.touched
    );
  }
}
