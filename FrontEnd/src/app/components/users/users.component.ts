import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface User {
  id: string;
  name: string;
  email: string;
}


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {
  constructor(
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  displayedColumns: string[] = ['nr', 'name', 'email', 'actions'];
  dataSource = new MatTableDataSource<User>([]);

  ngOnInit() {
    this.apiService.selectAll('users').subscribe(data => {
      this.dataSource.data = data as User[];
    });
  }

  editUser(user: User) {
    // Implement edit user functionality
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
        });
      }
    });
  }
}
