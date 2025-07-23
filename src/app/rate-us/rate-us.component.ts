import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rate-us',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rate-us.component.html',
  styleUrls: ['./rate-us.component.css']
})
export class RateUsComponent implements OnInit {
  rating = 0;
  hovered = 0;
  user: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const nav = history.state?.user;
    if (nav) {
      this.user = nav;

      // ✅ Load user from backend
      this.http.get<any>(`http://localhost:3000/user/${this.user.id}`).subscribe({
        next: (data) => {
          this.rating = data?.rating || 0;
        },
        error: (err) => {
          console.error('❌ Failed to load rating:', err);
        }
      });
    }
  }

  setRating(value: number) {
    this.rating = value;

    this.http.put('http://localhost:3000/user/rate', {
  id: this.user.id,
  rating: value
})
.subscribe({
      next: () => {
        console.log(`${this.user.name} rated: ${value}`);
      },
      error: (err) => {
        console.error('❌ Rating failed:', err);
        alert('❌ Failed to submit rating');
      }
    });
  }

  setHover(value: number) {
    this.hovered = value;
  }

  clearHover() {
    this.hovered = 0;
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

  goBack() {
    history.back();
  }
}
