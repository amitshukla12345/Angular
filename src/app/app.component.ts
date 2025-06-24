import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { RateUsComponent } from './rate-us/rate-us.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,         // Enables routing
    ProfileComponent,     // If you're using <app-profile>
    RateUsComponent       // Enables <app-rate-us>
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {}
