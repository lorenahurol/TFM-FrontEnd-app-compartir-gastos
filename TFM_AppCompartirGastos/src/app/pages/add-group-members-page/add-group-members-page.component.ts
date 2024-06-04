import { Component } from '@angular/core';
import { AddGroupMembersComponent } from '../../components/add-group-members/add-group-members.component';

@Component({
  selector: 'app-add-group-members-page',
  standalone: true,
  imports: [AddGroupMembersComponent],
  templateUrl: './add-group-members-page.component.html',
  styleUrl: './add-group-members-page.component.css'
})
export class AddGroupMembersPageComponent {

}
