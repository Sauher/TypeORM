import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { ApiService } from '../../services/api.service';

export interface UserDialogData {
  isEditMode: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
  ],
  templateUrl: './userdialog.html',
})
export class UserDialogComponent {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent>);
  readonly dialogData = inject<UserDialogData>(MAT_DIALOG_DATA);

  isEditMode = this.dialogData.isEditMode;

  userForm: FormGroup = this.fb.group({
    name: [this.dialogData.user?.name || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
    email: [this.dialogData.user?.email || '', [Validators.required, Validators.email, Validators.maxLength(100)]],
    password: [{ value: '', disabled: this.isEditMode }, this.isEditMode ? [] : [Validators.required, Validators.minLength(6), Validators.maxLength(40)]],
  });

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formValue = this.userForm.value;

    if (this.isEditMode && this.dialogData.user) {
      this.apiService.update('users', this.dialogData.user.id, formValue).subscribe(result => {
        this.dialogRef.close(result);
      });
    } else {
      this.apiService.create('users', formValue).subscribe(result => {
        this.dialogRef.close(result);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
