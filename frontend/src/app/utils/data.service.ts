import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseURL: string = environment.url;

  constructor(private http: HttpClient) {}

  getData(username: string) {
    return this.http.get(this.baseURL + username);
  }
}
