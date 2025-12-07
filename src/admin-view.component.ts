import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface UserRating {
  id: number;
  name: string;
  email: string;
  rating: number;
  role: string;
}

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-container">
      <h2 class="center-text">📊 User Ratings Dashboard (Admin View)</h2>
      
      <div class="controls">
        <button (click)="refreshData()" class="btn btn-primary">
          🔄 Refresh Ratings
        </button>
        <button (click)="toggleStats()" class="btn btn-info">
          {{ showStats ? 'Hide' : 'Show' }} Statistics
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        ⏳ Loading ratings data...
      </div>

      <div *ngIf="showStats" class="stats-container">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Total Users</div>
            <div class="stat-value">{{ totalUsers }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Rated Users</div>
            <div class="stat-value">{{ ratedUsers }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Average Rating</div>
            <div class="stat-value">{{ averageRating | number:'1.1-1' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Highest Rating</div>
            <div class="stat-value">{{ highestRating }}</div>
          </div>
        </div>
      </div>

      <div *ngIf="!loading && userRatings.length > 0" class="ratings-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Rating</th>
              <th>Stars</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of userRatings">
              <td>{{ user.id }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.role }}</td>
              <td class="rating-value">{{ user.rating }}</td>
              <td class="stars">{{ getStars(user.rating) }}</td>
              <td class="feedback">{{ getFeedback(user.rating) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div *ngIf="!loading && userRatings.length === 0" class="empty-state">
        <p>📭 No ratings submitted yet.</p>
        <p>Users need to submit ratings from the "Rate Us" page.</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
      background: #f8f9fa;
      border-radius: 10px;
    }

    .center-text {
      text-align: center;
      margin-bottom: 30px;
      color: #2c3e50;
    }

    .controls {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }

    .btn-primary {
      background-color: #007bff;
      color: white;
    }

    .btn-info {
      background-color: #17a2b8;
      color: white;
    }

    .loading {
      text-align: center;
      padding: 40px;
      font-size: 18px;
      color: #666;
    }

    .stats-container {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
    }

    .stat-item {
      text-align: center;
      padding: 15px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .stat-label {
      font-size: 14px;
      color: #666;
      margin-bottom: 5px;
    }

    .stat-value {
      font-size: 24px;
      font-weight: bold;
      color: #2c3e50;
    }

    .ratings-table {
      overflow-x: auto;
      margin-top: 20px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    th {
      background-color: #2c3e50;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: bold;
    }

    td {
      padding: 12px 15px;
      border-bottom: 1px solid #eee;
    }

    tr:hover {
      background-color: #f5f5f5;
    }

    .rating-value {
      font-weight: bold;
      color: #f39c12;
      font-size: 18px;
      text-align: center;
    }

    .stars {
      color: #f1c40f;
      font-size: 18px;
    }

    .feedback {
      color: #666;
      font-style: italic;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #666;
      background: white;
      border-radius: 8px;
      margin-top: 20px;
    }
  `]
})
export class AdminViewComponent implements OnInit {
  userRatings: UserRating[] = [];
  loading = true;
  showStats = true;
  
  // Statistics
  totalUsers = 0;
  ratedUsers = 0;
  averageRating = 0;
  highestRating = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRatings();
  }

  loadRatings(): void {
    this.loading = true;
    console.log('📥 Loading user ratings...');
    
    this.http.get<any[]>('http://localhost:3000/user').subscribe({
      next: (users) => {
        console.log('✅ Users loaded:', users.length);
        
        // Filter only users with ratings > 0
        this.userRatings = users
          .filter(user => user.rating > 0)
          .map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            rating: user.rating || 0
          }))
          .sort((a, b) => b.rating - a.rating); // Sort by highest rating
        
        this.calculateStatistics(users);
        this.loading = false;
        
        console.log('📊 Ratings loaded:', this.userRatings.length);
      },
      error: (err) => {
        console.error('❌ Failed to load ratings:', err);
        this.loading = false;
      }
    });
  }

  calculateStatistics(allUsers: any[]): void {
    this.totalUsers = allUsers.length;
    
    const usersWithRatings = allUsers.filter(user => user.rating > 0);
    this.ratedUsers = usersWithRatings.length;
    
    const totalRating = usersWithRatings.reduce((sum, user) => sum + user.rating, 0);
    this.averageRating = this.ratedUsers > 0 ? totalRating / this.ratedUsers : 0;
    
    this.highestRating = Math.max(...usersWithRatings.map(user => user.rating), 0);
  }

  refreshData(): void {
    console.log('🔄 Refreshing ratings data...');
    this.loadRatings();
  }

  toggleStats(): void {
    this.showStats = !this.showStats;
  }

  getStars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }

  getFeedback(rating: number): string {
    switch (rating) {
      case 1: return 'Very Poor';
      case 2: return 'Poor';
      case 3: return 'Average';
      case 4: return 'Good';
      case 5: return 'Excellent';
      default: return 'Not Rated';
    }
  }
}