import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgGridAngular } from 'ag-grid-angular';
import {
  ModuleRegistry,
  AllCommunityModule,
  ColDef,
  GridReadyEvent,
  RowSelectionOptions
} from 'ag-grid-community';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faEdit, faSave } from '@fortawesome/free-solid-svg-icons';

import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { RouterLinkRendererComponent } from '../router-link-renderer/router-link-renderer.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    AgGridAngular,
    ActionCellRendererComponent,
    RouterLinkRendererComponent
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  constructor(library: FaIconLibrary, private location: Location) {
    library.addIcons(faEdit, faSave);
  }

  showModal = false;
  newUser = { name: '', email: '', role: 'Viewer' };

  users = [
    { name: 'Amit', email: 'amit@example.com', role: 'Admin' },
    { name: 'Riya', email: 'riya@example.com', role: 'Editor' },
    { name: 'Rahul', email: 'rahul@example.com', role: 'Viewer' }
  ];

  rowData = [...this.users];

  rowSelection: RowSelectionOptions = {
    mode: 'multiRow',
    checkboxes: true,
    headerCheckbox: true,
    enableClickSelection: true
  };

  private gridApi!: any;

  columnDefs: ColDef[] = [
    {
      headerName: '',
      checkboxSelection: true,
      headerCheckboxSelection: true,
      width: 50,
      pinned: 'left'
    },
    {
      headerName: 'Name',
      field: 'name',
      cellRenderer: RouterLinkRendererComponent,
      editable: true,
      sortable: true,
      filter: true
    },
    {
      field: 'email',
      editable: true,
      sortable: true,
      filter: true
    },
    {
      field: 'role',
      editable: true,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['Admin', 'Editor', 'Viewer'] },
      sortable: true,
      filter: true
    },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: ActionCellRendererComponent,
      width: 140,
      editable: false,
      filter: false,
      sortable: false
    }
  ];

  defaultColDef: ColDef = { flex: 1, resizable: true };
  editType: 'fullRow' = 'fullRow';
  suppressClickEdit = true;
  context = { componentParent: this };

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  submitUser(): void {
    const user = { ...this.newUser };
    this.gridApi.applyTransaction({ add: [user] });
    this.users.push(user);
    this.newUser = { name: '', email: '', role: 'Viewer' };
    this.showModal = false;
  }

  startRowEdit(rowIndex: number): void {
    this.gridApi.startEditingCell({ rowIndex, colKey: 'name' });
  }

  onRowSave(data: any): void {
    this.gridApi.applyTransaction({ update: [data] });
  }

  onRowDelete(data: any): void {
    this.gridApi.applyTransaction({ remove: [data] });
    this.users = this.users.filter(u => u !== data);
  }

  anySelected(): boolean {
    return this.gridApi?.getSelectedRows()?.length > 0;
  }

  deleteSelected(): void {
    const selected = this.gridApi.getSelectedRows();
    if (selected.length && confirm(`Delete ${selected.length} user(s)?`)) {
      this.gridApi.applyTransaction({ remove: selected });
      this.users = this.users.filter(u => !selected.includes(u));
    }
  }

  goBack(): void {
    this.location.back();
  }
}
