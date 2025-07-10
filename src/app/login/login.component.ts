import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../user/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  showPassword: boolean = false;

  constructor(private router: Router, private userService: UserService) {}

  login() {
    this.userService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        alert(res.message);
        if (res.message.includes('successful')) {
          sessionStorage.setItem('email', this.email);
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err: HttpErrorResponse) => {
        console.error('Login error:', err);
        alert('Login failed');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
