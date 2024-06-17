import { Component } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingPageComponent {

}
