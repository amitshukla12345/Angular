// src/app/user/action-cell-renderer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEdit, faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-cell-renderer',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    <button (click)="editRow()" title="Edit">
      <fa-icon [icon]="faEdit"></fa-icon>
    </button>
    <button (click)="saveRow()" title="Save">
      <fa-icon [icon]="faSave"></fa-icon>
    </button>
    <button (click)="openRating()" title="Rate User">
      <fa-icon [icon]="faStar" style="color:gold;"></fa-icon>
    </button>
  `,
  styles: [`
    button {
      margin: 0 4px;
      border: none;
      background: none;
      cursor: pointer;
    }
  `]
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  faEdit = faEdit;
  faSave = faSave;
  faStar = faStar;

  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  editRow(): void {
    this.params.context.componentParent.startRowEdit(this.params.rowIndex);
  }

  saveRow(): void {
    this.params.context.componentParent.onRowSave(this.params.data);
  }

  openRating(): void {
    this.params.context.componentParent.openRateUsModal(this.params.data);
  }
}
