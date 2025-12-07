import { Component, OnInit } from '@angular/core';
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
import { faEdit, faSave, faStar } from '@fortawesome/free-solid-svg-icons';

import { ActionCellRendererComponent } from './action-cell-renderer.component';
import { RouterLinkRendererComponent } from '../router-link-renderer/router-link-renderer.component';
import { UserService } from './user.service';
import { User } from './user.model';
import { Router } from '@angular/router';

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
export class UserComponent implements OnInit {
  constructor(
    library: FaIconLibrary,
    private location: Location,
    private userService: UserService,
    private router: Router
  ) {
    library.addIcons(faEdit, faSave, faStar);
  }

  showModal = false;
  // ✅ PASSWORD FIELD ADD KIYA
  newUser: User = { name: '', email: '', role: 'Viewer', password: '' };
  rowData: User[] = [];

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
      width: 160,
      editable: false,
      filter: false,
      sortable: false
    }
  ];

  defaultColDef: ColDef = { flex: 1, resizable: true };
  editType: 'fullRow' = 'fullRow';
  suppressClickEdit = true;
  context = { componentParent: this };

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUser().subscribe({
      next: (data: User[]) => {
        this.rowData = data;
      },
      error: (err: any) => {
        console.error('Error fetching users', err);
        alert('Failed to fetch users from server');
      }
    });
  }

  onGridReady(params: GridReadyEvent): void {
    this.gridApi = params.api;
    this.gridApi.sizeColumnsToFit();
  }

  submitUser(): void {
    // ✅ PASSWORD VALIDATION ADD KIYA
    if (!this.newUser.name || !this.newUser.email || !this.newUser.password) {
      alert('❌ Name, Email, and Password are required!');
      return;
    }

    const user = { ...this.newUser };
    this.userService.addUser(user).subscribe({
      next: (createdUser) => {
        this.gridApi.applyTransaction({ add: [createdUser] });
        this.rowData.push(createdUser);
        // ✅ PASSWORD RESET KIY
        this.newUser = { name: '', email: '', role: 'Viewer', password: '' };
        this.showModal = false;
        alert('✅ User added successfully!');
      },
      error: (err) => {
        console.error('Error adding user:', err);
        alert(`❌ Failed to add user: ${err.error?.message || 'Server error'}`);
      }
    });
  }

  onRowDelete(data: User): void {
    if (!data || !data.id) {
      alert('User ID not found.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${data.name}?`)) {
      this.userService.deleteUser(data.id).subscribe({
        next: () => {
          this.gridApi.applyTransaction({ remove: [data] });
          this.rowData = this.rowData.filter(u => u.id !== data.id);
          alert(`User ${data.name} deleted.`);
        },
        error: (err) => {
          console.error('Error deleting user:', err);
          alert('Failed to delete user.');
        }
      });
    }
  }

  onRowSave(data: User): void {
    if (!data.id) {
      alert('Cannot update user without ID.');
      return;
    }

    this.userService.updateUser(data.id, data).subscribe({
      next: (updatedUser) => {
        this.gridApi.applyTransaction({ update: [updatedUser] });
        alert(`User ${updatedUser.name} updated.`);
      },
      error: (err) => {
        console.error('Error updating user:', err);
        alert('Failed to update user.');
      }
    });
  }

  startRowEdit(rowIndex: number): void {
    this.gridApi.startEditingCell({ rowIndex, colKey: 'name' });
  }

  anySelected(): boolean {
    return this.gridApi?.getSelectedRows()?.length > 0;
  }

  deleteSelected(): void {
    const selected: User[] = this.gridApi.getSelectedRows();
    if (selected.length && confirm(`Delete ${selected.length} user(s)?`)) {
      selected.forEach((user: User) => {
        if (user.id !== undefined) {
          this.userService.deleteUser(user.id).subscribe({
            next: () => {
              this.gridApi.applyTransaction({ remove: [user] });
              this.rowData = this.rowData.filter(u => u.id !== user.id);
            },
            error: () => alert(`Failed to delete user ${user.name}`)
          });
        } else {
          alert(`Cannot delete user ${user.name}, missing ID`);
        }
      });
    }
  }

  refreshUsers(): void {
    this.fetchUsers();
    alert('User list refreshed.');
  }

  goBack(): void {
    this.location.back();
  }

  openRateUsModal(user: User): void {
    this.router.navigate(['/dashboard/rate-us'], {
      state: { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
    });
  }
}