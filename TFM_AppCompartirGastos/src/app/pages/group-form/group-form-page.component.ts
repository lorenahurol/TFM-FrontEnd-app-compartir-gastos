import { Component } from '@angular/core';
import { GroupFormComponent } from '../../components/group-form/group-form.component';

@Component({
  selector: 'app-group-form-page',
  standalone: true,
  imports: [GroupFormComponent],
  templateUrl: './group-form-page.component.html',
  styleUrl: './group-form-page.component.css'
})
export class GroupFormPageComponent {
  typeH2: string = "Crear";
  typeH3: string = "Nuevo";

}
