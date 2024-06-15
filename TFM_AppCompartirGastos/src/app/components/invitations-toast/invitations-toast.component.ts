import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invitations-toast',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './invitations-toast.component.html',
  styleUrl: './invitations-toast.component.css'
})
export class InvitationsToastComponent {
  
}
