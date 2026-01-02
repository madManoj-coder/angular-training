import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  
  private tasks: Task[] = [];
  private taskSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.taskSubject.asObservable();

  constructor() {
    this.loadTasks();
  }

  private loadTasks() {
    const data = localStorage.getItem('tasks');
    if (data) {
      this.tasks = JSON.parse(data);
    } else {
      this.tasks = [];
    }
    this.taskSubject.next([...this.tasks]);
  }

  private saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.taskSubject.next([...this.tasks]);
  }

  getTasks() {
    return this.tasks$;
  }

  addTask(task: Task) {
    const newTask = { ...task, id: Date.now() };
    this.tasks = [newTask, ...this.tasks];
    this.saveTasks();
  }

  updateTask(task: Task) {
    this.tasks = this.tasks.map(t => t.id === task.id ? { ...task } : t);
    this.saveTasks();
  }

  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
  }
}
