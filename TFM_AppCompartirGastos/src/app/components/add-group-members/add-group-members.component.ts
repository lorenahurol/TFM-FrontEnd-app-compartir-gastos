import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InvitationsService } from '../../services/invitations.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-group-members',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-group-members.component.html',
  styleUrl: './add-group-members.component.css'
})
export class AddGroupMembersComponent {

  inviteMembersForm: FormGroup;
  HttpClient = inject(HttpClient);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  invitationsService = inject(InvitationsService);

  groupId: string = "";

  constructor() {
    this.inviteMembersForm = new FormGroup({
      username: new FormControl("", [
        // Validadores:
        Validators.required
        // ** Comprobar que existe en BD ** //
      ]),
      message: new FormControl("", [
        Validators.maxLength(400)
      ]),
    }, [])
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.groupId) {
        this.groupId = params.groupId;
      }
    });
  }

  async getDataForm(): Promise<void> {
    if (this.inviteMembersForm.valid) {
      try {
        const data = {
          username: this.inviteMembersForm.value.username,
          groupId: this.groupId,
          message: this.inviteMembersForm.value.message
        }
        const result = await this.invitationsService.createInvitation(data);
        console.log(result);
        this.inviteMembersForm.reset();
        this.router.navigate(['/groups']);
        
      } catch (error) {
        console.error(error);
      }
    }
  }

  // Comprobar validadores:
  checkControl(formControlName: string, validatorName: string): boolean | undefined {
    return (
      this.inviteMembersForm.get(formControlName)?.hasError(validatorName) &&
      this.inviteMembersForm.get(formControlName)?.touched
    );
  }
}
