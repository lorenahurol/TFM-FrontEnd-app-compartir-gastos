import { Component } from '@angular/core';
import { CreateGroupFormComponent } from '../../components/create-group-form/create-group-form.component';

@Component({
  selector: 'app-create-group',
  standalone: true,
  imports: [CreateGroupFormComponent],
  templateUrl: './create-group.component.html',
  styleUrl: './create-group.component.css'
})
export class CreateGroupComponent {

}
