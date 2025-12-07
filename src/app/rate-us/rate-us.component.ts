import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  // ✅ Add headers
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const nav = history.state?.user;
    if (nav) {
      this.user = nav;
      console.log('👤 User from history:', this.user);

      // ✅ Load user from backend with headers
      this.http.get<any>(`http://localhost:3000/user/${this.user.id}`, 
        { headers: this.headers }
      ).subscribe({
        next: (data) => {
          console.log('✅ User data loaded:', data);
          this.rating = data?.data?.rating || data?.rating || 0;
        },
        error: (err) => {
          console.error('❌ Failed to load rating:', err);
          console.log('Error details:', err.error);
        }
      });
    } else {
      console.error('❌ No user found in history state');
    }
  }

  setRating(value: number) {
    console.log('⭐ Setting rating to:', value);
    
    if (!this.user?.id) {
      alert('❌ User not found!');
      return;
    }

    const oldRating = this.rating;
    this.rating = value;

    const ratingData = {
      id: this.user.id,
      rating: value,
      //userName: this.user.name || 'Anonymous'
    };

    console.log('📤 Sending rating data:', ratingData);

    // ✅ Send with headers
    this.http.put('http://localhost:3000/user/rate', 
      ratingData,
      { headers: this.headers }
    ).subscribe({
      next: (response: any) => {
        console.log('✅ Rating successful:', response);
        console.log(`${this.user.name} rated: ${value}`);
        
        // Show success message
        if (response?.success) {
          alert(`✅ ${response.message}`);
        }
      },
      error: (err) => {
        console.error('❌ Rating failed:', err);
        console.log('Full error:', err);
        console.log('Error response:', err.error);
        
        // Revert on error
        this.rating = oldRating;
        
        // Show detailed error
        let errorMsg = 'Failed to submit rating';
        if (err.error?.message) {
          errorMsg = err.error.message;
        }
        alert(`❌ ${errorMsg}`);
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

  // ✅ Debug function
  debugInfo() {
    console.log('=== DEBUG INFO ===');
    console.log('User ID:', this.user?.id);
    console.log('User Name:', this.user?.name);
    console.log('Current Rating:', this.rating);
    console.log('===============');
  }
}