import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../login.service'; // Adjust path if needed
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private loginService: LoginService) {}

  login() {
    this.loginService.login(this.username, this.password).subscribe({
      next: (res) => {
        alert(res.message);
        if (res.message.includes('successful')) {
          sessionStorage.setItem('username', this.username);
          this.router.navigate(['/dashboard']); //  route to dashboard
        }
      },
      error: (err) => {
        console.error('Login error:', err);
        alert('Login failed ');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
