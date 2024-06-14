import { ViewportScroller } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  authService = inject(AuthService);

  isLoggedIn: boolean = false;

  navigate(destination: string) {
    this.router.navigate(['/landing']).then(() => {
      this.viewportScroller.scrollToAnchor(destination);
    });
  }

  async ngOnInit(): Promise<void> {
    const token = localStorage.getItem("login_token");
    if (token) {
      try {
        const tokenVerification = await this.authService.verifyToken(token);
        if (tokenVerification && tokenVerification.id) {
          this.isLoggedIn = true;
        }
      } catch (error) {
        this.isLoggedIn = false;
      }
    }
  }

  logout() {
    const result = this.authService.logout();
    if (result.success) {
      this.isLoggedIn = false;
      this.router.navigate(['/login']);
    } else {
      console.error("Error al cerrar sesión");
    }
  }
}

