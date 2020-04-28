export class WorkItem {
    id: string;
    name: string;
    description: string;
    type: string;
    status: string;
    assignedTo: string;
    tasks: Task[];
}

export class Task {
    id: string;
    assignedTo: string;
    status: string;
    name: string;
}
