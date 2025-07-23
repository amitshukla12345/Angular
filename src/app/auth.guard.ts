import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const email = sessionStorage.getItem('email'); // Check if user is logged in

    if (email) {
      return true;
    }

    alert('Please log in to continue.');
    this.router.navigate(['/login']); // Redirect to login page
    return false;
  }
}
