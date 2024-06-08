import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { lastValueFrom } from 'rxjs';
import { ITokenVerification } from '../interfaces/itoken-verification.interface';
import { ILoginBody } from '../interfaces/ilogin-body.interface';
import { ILoginResponse } from '../interfaces/ilogin-response.interface';


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
   * @param {ILoginBody} loginBody - The login data containing email and password.
   * @returns {Promise<ILoginResponse>} - A promise that resolves to the response of the login request.
   */
  login(loginBody: ILoginBody): Promise<ILoginResponse> {
    return lastValueFrom(
      this.httpClient.post<ILoginResponse>(`${this.API_URL}/login`, loginBody)
    );
  }

  /**
   * Verifies a token by sending a GET request to the /login/:token endpoint.
   *
   * @param {string} token - The token to be verified.
   * @returns {Promise<TokenVerification>} - A promise that resolves to the token payload 
   * {"exp": expiration date (unix), 
   *  "id": logged user id, 
   *  "username": logged username, 
   *  "name": name of logged user, 
   *  "iat": emission date (unix)}
   */
  verifyToken(token: string) {
    return lastValueFrom<ITokenVerification>(
      this.httpClient.get(`${this.API_URL}/login/${token}`)
    );
  }
}
