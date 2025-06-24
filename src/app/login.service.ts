import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      'http://localhost:3000/login',
      { username, password }, //  Payload
      {
        headers: {
          'Content-Type': 'application/json' //  Required
        }
      }
    );
  }
}
