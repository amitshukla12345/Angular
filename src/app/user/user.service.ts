import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  getAllUser(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // ✅ Get a single user by ID
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // ✅ FIXED: Update rating with correct data format
  updateRating(userId: number, rating: number): Observable<User> {
    const ratingData = {
      id: userId,
      rating: rating
    };
    
    console.log('📤 Sending rating update:', ratingData);
    return this.http.put<User>(`${this.apiUrl}/rate`, ratingData);
  }

  // ✅ Alternative: If you want to use partial user
  updateUserRating(userId: number, rating: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, { rating });
  }

  // ✅ Get dashboard data for admin view
  getDashboardData(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dashboard-data`);
  }

  // ✅ Register new user
  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }
}