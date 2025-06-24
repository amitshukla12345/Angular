import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-cell-renderer',
  template: `
    <span class="action-icons">
      <i class="fa fa-user-edit" title="Edit Name" (click)="edit('name')"></i>
      <i class="fa fa-envelope" title="Edit Email" (click)="edit('email')"></i>
      <i class="fa fa-user-tag" title="Edit Role" (click)="edit('role')"></i>
    </span>
  `,
  styles: [`
    .action-icons i {
      cursor: pointer;
      margin: 0 6px;
      color: #555;
    }
    .action-icons i:hover {
      color: #000;
    }
  `]
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: any): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }

  edit(field: string): void {
    if (this.params?.api?.startEditingCell) {
      this.params.api.startEditingCell({
        rowIndex: this.params.node.rowIndex,
        colKey: field
      });
    }
  }
}
