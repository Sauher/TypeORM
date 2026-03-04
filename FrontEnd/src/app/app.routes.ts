import { Routes } from '@angular/router';
import { TasksComponent } from './components/tasks/tasks.component';
import { UsersComponent } from './components/users/users.component';

export const routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: 'tasks', component: TasksComponent },
    { path: '', redirectTo: '/users', pathMatch: 'full' }
];
