import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-router-link-renderer',
  standalone: true,
  template: `<a class="user-link" (click)="onClick()">{{ params?.value }}</a>`,
  styles: [`
    .user-link {
      color: #007bff;
      cursor: pointer;
      text-decoration: underline;
    }
  `]
})
export class RouterLinkRendererComponent implements ICellRendererAngularComp {
  params: any;
  private router = inject(Router);

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  onClick(): void {
    const name = this.params?.value;
    if (name) {
      this.router.navigate(['/user', name]);
    }
  }
}
