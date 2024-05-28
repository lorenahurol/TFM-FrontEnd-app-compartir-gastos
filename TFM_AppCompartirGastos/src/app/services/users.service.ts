import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environments';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';
import { PHONE_CODES } from '../db/international_codes.db';

type PhoneCode = {
  name: string,
  code: string
}

type RegisterBody = {
  mail: string,
  username: string,
  password: string,
  firstname: string,
  lastname: string,
  phone?: string
}

type LoginBody = {
  email: string,
  password: string,
  rememberMe: boolean
}

type LoginResponse = {
  message?: string,
  error?: string,
  token?: string
}

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private httpClient = inject(HttpClient);

  // URL de entorno
  private API_URL: string | undefined;

  private phoneCodesArr: Array<PhoneCode> = PHONE_CODES;

  constructor() {
    this.API_URL = environment.API_URL;
  }

  getAllInternationalCodes() {
    return this.phoneCodesArr
  }

  /**
   * Método para obtener todos los usuarios activos de un grupo
   */
  getUsersByGroup(groupId: number): Promise<IUser[]> {
    return lastValueFrom(
      this.httpClient.get<IUser[]>(`${this.API_URL}/users/bygroup/${groupId}`)
    );
  }

  /**
   * Creates a new user by sending a POST request to the /register endpoint.
   *
   * @param {RegisterBody} newUser - The data for the new user to be registered.
   * @returns {Promise<loginResponse>} - A promise that resolves to the response of the registration request.
   */
  createNewUser(newUser: RegisterBody): Promise<LoginResponse> {
    return lastValueFrom(
      this.httpClient.post<LoginResponse>(`${this.API_URL}/register`, newUser)
    );
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
}