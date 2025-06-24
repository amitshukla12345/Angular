import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  username = '';

  ngOnInit(): void {
    // Get current user from sessionStorage
    this.username = sessionStorage.getItem('username') || 'Guest';

    // Load user's existing rating if present
    const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    if (allRatings[this.username]) {
      this.rating = allRatings[this.username];
    }
  }

  setRating(value: number) {
    this.rating = value;

    const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    allRatings[this.username] = value;
    localStorage.setItem('ratings', JSON.stringify(allRatings));

    console.log(`${this.username} rated: ${value}`);
  }

  setHover(value: number) {
    this.hovered = value;
  }

  clearHover() {
    this.hovered = 0;
  }

  getEmoji(rating: number): string {
    if (rating === 1) return '😡';
    if (rating === 2) return '😕';
    if (rating === 3) return '🙂';
    if (rating === 4) return '😊';
    if (rating === 5) return '🤩';
    return '';
  }
}
