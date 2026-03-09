import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Task } from '../tasks/tasks.component';
import {MatCheckboxModule} from '@angular/material/checkbox';

export interface TaskDialogData {
  isEditMode: boolean;
  task?: Task;
}

@Component({
  selector: 'app-task-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    NgIf,
  ],
  templateUrl: './task-dialog.html',
})
export class TaskDialogComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  readonly dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  readonly dialogData = inject<TaskDialogData>(MAT_DIALOG_DATA);

  isEditMode = this.dialogData.isEditMode;

 TaskForm: FormGroup = this.fb.group({
        title: [this.dialogData.task?.title || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        description: [this.dialogData.task?.description || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
        completed: [this.dialogData.task?.completed || false, [Validators.required]],
  });

  onSubmit(): void {
    if (this.TaskForm.invalid) return;

    const formValue = this.TaskForm.value;

    if (this.isEditMode && this.dialogData.task) {
      this.apiService.update('tasks', this.dialogData.task.id, formValue).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      this.apiService.create('tasks', formValue).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
