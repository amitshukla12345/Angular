import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/user/dashboard-data'; 

  constructor(private http: HttpClient) {}

  getDashboardData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
