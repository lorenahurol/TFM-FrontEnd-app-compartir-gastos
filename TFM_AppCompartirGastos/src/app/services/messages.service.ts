import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private httpClient = inject(HttpClient);

  constructor() {}
}
