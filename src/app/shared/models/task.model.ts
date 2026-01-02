export interface Task {
  id: number;
  assignedTo: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: Date;
  priority: 'Low' | 'Normal' | 'High';
  description: string;
  selected?: boolean;
}