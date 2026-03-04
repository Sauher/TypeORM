import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule} from '@angular/material/table';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';

export interface User {
  id: string;
  name: string;
  email: string;
}


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [MatTableModule,MatButtonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit{

  constructor(private apiService: ApiService) { }

    displayedColumns: string[] = ['name', 'email','actions'];
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
    // Implement delete user functionality
  }
}
