import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss']
})
export class TaskDialogComponent implements OnInit {

  taskForm!: FormGroup;
  isEdit = false;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private snackbar:SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.isEdit = !!this.data?.task;

    this.taskForm = this.fb.group({
      assignedTo: ['', Validators.required],
      status: ['Pending', Validators.required],
      dueDate: ['', Validators.required],
      priority: ['Low', Validators.required],
      description: ['', Validators.required]
    });

    if (this.isEdit) {
      this.taskForm.patchValue(this.data.task);
    }
  }

  save() {
    if (this.isEdit) {
      this.taskService.updateTask({
        id: this.data.task.id,
        ...this.taskForm.value
      });
      this.snackbar.success(`Task "${this.taskForm.value.assignedTo}" updated successfully`);
    } else {
      this.taskService.addTask(this.taskForm.value);
      this.snackbar.success(`New Task "${this.taskForm.value.assignedTo}" added successfully`);
    }
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
