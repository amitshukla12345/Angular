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
  user: any = null;

  ngOnInit(): void {
    const nav = history.state?.user;
    if (nav) {
      this.user = nav;

      const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
      if (allRatings[this.user.id]) {
        this.rating = allRatings[this.user.id]?.rating || 0;
      }
    }
  }

  setRating(value: number) {
    this.rating = value;

    const allRatings = JSON.parse(localStorage.getItem('ratings') || '{}');
    allRatings[this.user.id] = {
      name: this.user.name,
      email: this.user.email,
      role: this.user.role,
      rating: value
    };
    localStorage.setItem('ratings', JSON.stringify(allRatings));

    console.log(`${this.user.name} rated: ${value}`);
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
