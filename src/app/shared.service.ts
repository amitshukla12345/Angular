import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SharedService {
  private username: string = '';

  setUsername(name: string) {
    this.username = name;
  }

  getUsername(): string {
    return this.username;
  }

  clearUsername() {
    this.username = '';
  }
}
