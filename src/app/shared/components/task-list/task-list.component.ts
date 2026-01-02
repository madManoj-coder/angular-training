import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Task } from '../../models/task.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, AfterViewInit {

  displayedColumns : string[]= ['select','assignedTo', 'status', 'dueDate', 'priority', 'comments', 'actions'];
  tasks: Task[]=[];
  dataSource: MatTableDataSource<Task> = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  pageSize:number = 10;
  pageIndex:number = 0;
  totalLength:number = 0;


  constructor(
    private taskService: TaskService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.dataSource.data = tasks;
    });
  }

  ngAfterViewInit() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  addTask() {
    this.dialog.open(TaskDialogComponent, {
      width: '600px'
    });
  }

  editTask(task: Task) {
    this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: { task }
    });
  }

  deleteTask(task: Task) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { name: task.assignedTo }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.deleteTask(task.id);
      }
    });
  }

  refreshPage(){
    window.location.reload()
  }

  onPageChange(event: PageEvent) {
  this.pageSize = event.pageSize;
  this.pageIndex = event.pageIndex;
  this.totalLength = event.length;
  console.log('Active page size:', this.pageSize, this.pageIndex, this.totalLength);
}

getCurrentPageRows(): Task[] {
  const start = this.pageIndex * this.pageSize;
  const end = start + this.pageSize;
  return this.dataSource.filteredData.slice(start, end);
}

isAllChecked(): boolean {
  const rows = this.getCurrentPageRows();
  return rows.length > 0 && rows.every(r => r.selected);
}

isIndeterminate(): boolean {
  const rows = this.getCurrentPageRows();
  const selectedCount = rows.filter(r => r.selected).length;
  return selectedCount > 0 && selectedCount < rows.length;
}

toggleAll(event: any): void {
  const rows = this.getCurrentPageRows();
  rows.forEach(r => (r.selected = event.checked));
}

}
