import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  authServices = inject(AuthService)
  router = inject (Router)

  async getDataForm(loginForm: any) {
    let loginBody = loginForm.value
    if (!loginBody.mail || !loginBody.password) {
      alert("Los campos email y contraseña son obligatorios")
    } else {
      
      // configura manualmente el valor de rememberMe en caso no haya sido tocado por el usuario
      if (loginBody.rememberMe === "")
        loginBody.rememberMe = false
      try {
        let response = await this.authServices.login(loginBody)
        localStorage.setItem('login_token', response.token!)
        this.router.navigateByUrl ('/home')
      } catch (err: any) {
        alert (err.error.error)
      }
    }
  }

  ngOnInit() {
    if (localStorage.getItem('login_token')) this.router.navigateByUrl('/home')
  }

}
