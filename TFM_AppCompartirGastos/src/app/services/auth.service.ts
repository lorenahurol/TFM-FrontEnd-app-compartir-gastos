import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { lastValueFrom } from 'rxjs';

type LoginBody = {
  mail: string;
  password: string;
  rememberMe: boolean;
};

type LoginResponse = {
  message?: string;
  error?: string;
  errno?: number;
  token?: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);

  // URL de entorno
  private API_URL: string | undefined;

  constructor() {
    this.API_URL = environment.API_URL;
  }

  /**
   * Logs in a user by sending a POST request to the /login endpoint.
   *
   * @param {loginBody} loginBody - The login data containing email and password.
   * @returns {Promise<loginResponse>} - A promise that resolves to the response of the login request.
   */
  login(loginBody: LoginBody): Promise<LoginResponse> {
    return lastValueFrom(
      this.httpClient.post<LoginResponse>(`${this.API_URL}/login`, loginBody)
    );
  }

  checkToken() {
    
  }
}
