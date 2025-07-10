import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { LoginService } from './login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit() {
    const storedUser = sessionStorage.getItem('username');

    if (!storedUser) {
      this.loginService.login('admin', 'admin').subscribe({
        next: (res) => {
          console.log('✅ Login response:', res.message);
          if (res.message.includes('Login successful')) {
            sessionStorage.setItem('username', 'admin');
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          console.error('Login failed:', err);
        }
      });
    } else {
      console.log('🔄 Already logged in as:', storedUser);
    }
  }
}
