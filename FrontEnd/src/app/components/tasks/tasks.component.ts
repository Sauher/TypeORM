import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import {MatSelectModule} from '@angular/material/select';
import { User } from '../users/users.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatDialogModule, MatSortModule, MatPaginatorModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})


export class TasksComponent {

  constructor(
      private apiService: ApiService,
      private dialog: MatDialog,
      private _snackBar: MatSnackBar
    ) {}
  
    @ViewChild(MatSort) sort!: MatSort;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    displayedColumns: string[] = ['nr', 'title', 'description', 'user', 'completed', 'actions'];
    dataSource = new MatTableDataSource<Task>([]);
    users : User[] = [];
    selectedUserId: string = '';

    ngOnInit() {
      this.apiService.selectAll('tasks').subscribe(data => {
        this.dataSource.data = data as Task[];
      });
      this.apiService.selectAll('users').subscribe(data => {
        this.users = data as User[];
      });
    }
  
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }
    applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onUserSelected(userId: string) {
    this.selectedUserId = userId;
    if (userId) {
      this.apiService.selectByParent('tasks', 'user', userId).subscribe(data => {
        this.dataSource.data = data as Task[];
      });
    } else {
      this.apiService.selectAll('tasks').subscribe(data => {
        this.dataSource.data = data as Task[];
      });
    }
  }

  addTask() {
    
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: { isEditMode: false }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataSource.data.push(result);
        this.dataSource._updateChangeSubscription();
      }
    });
  }
  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Confirm Delete',
            message: `Are you sure you want to delete "${task.title}"?`
          }
        });
    
        dialogRef.afterClosed().subscribe(confirmed => {
          if (confirmed) {
            this.apiService.delete('tasks', task.id).subscribe(() => {
              this.dataSource.data = this.dataSource.data.filter(t => t.id !== task.id);
              this._snackBar.open(`Task "${task.title}" deleted successfully`, 'Close', {
                duration: 3000
              });
            });
          }
        });
  }
  editTask(task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: { isEditMode: true, task }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the task in the data source
        const index = this.dataSource.data.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.dataSource.data[index] = result;
          this.dataSource._updateChangeSubscription();
        }
      }
    });

  }
}
