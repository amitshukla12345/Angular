import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2 class="center-text">📊 User Ratings (Admin View)</h2>

    <div *ngIf="hasRatings(); else noRatings" class="ratings-grid">
      <div class="grid-header">👤 Name</div>
      <div class="grid-header">🔔 Rating</div>

      <ng-container *ngFor="let key of objectKeys(userRatings)">
        <div class="grid-cell">{{ key }}</div>
        <div class="grid-cell">{{ userRatings[key] }} {{ getEmoji(userRatings[key]) }}</div>
      </ng-container>
    </div>

    <ng-template #noRatings>
      <p class="center-text">No ratings submitted yet.</p>
    </ng-template>
  `,
  styles: [`
    .center-text {
      text-align: center;
      margin-bottom: 20px;
    }

    .ratings-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 0 auto;
      max-width: 600px;
    }

    .grid-header {
      font-weight: bold;
      background-color:rgb(24, 130, 252);
      padding: 10px;
      text-align: center;
      border: 1px solid #ccc;
      border-radius: 5px;
    }

    .grid-cell {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 5px;
      text-align: center;
    }
  `]
})
export class AdminViewComponent implements OnInit {
  userRatings: Record<string, number> = {};

  ngOnInit(): void {
    const data = localStorage.getItem('ratings');
    this.userRatings = data ? JSON.parse(data) : {};
  }

  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  hasRatings(): boolean {
    return Object.keys(this.userRatings).length > 0;
  }

  getEmoji(rating: number): string {
    switch (rating) {
      case 1: return '😡';
      case 2: return '😕';
      case 3: return '🙂';
      case 4: return '😊';
      case 5: return '🤩';
      default: return '';
    }
  }
}
