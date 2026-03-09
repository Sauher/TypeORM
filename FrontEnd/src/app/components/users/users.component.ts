import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

export interface User {
  id: string;
  name: string;
  email: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatInputModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['nr', 'name', 'email', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  ngOnInit() {
    this.apiService.selectAll('users').subscribe(data => {
      this.dataSource.data = data as User[];
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  editUser(user: User) {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        isEditMode: true,
        user
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.dataSource.data.findIndex(u => u.id === result.id);
        if (index !== -1) {
          const updated = [...this.dataSource.data];
          updated[index] = result;
          this.dataSource.data = updated;
        }
        this._snackBar.open(`User "${result.name}" updated successfully`, 'Close', {
          duration: 3000
        });
      }
    });
  }

  addUser() {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '400px',
      data: {
        isEditMode: false
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data = [...this.dataSource.data, result];
        this._snackBar.open(`User "${result.name}" added successfully`, 'Close', {
          duration: 3000
        });
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  deleteUser(user: User) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete "${user.name}"?`
      }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.apiService.delete('users', user.id).subscribe(() => {
          this.dataSource.data = this.dataSource.data.filter(u => u.id !== user.id);
          this._snackBar.open(`User "${user.name}" deleted successfully`, 'Close', {
            duration: 3000
          });
        });
      }
    });
  }
}
