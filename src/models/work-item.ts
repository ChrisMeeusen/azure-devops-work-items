export class WorkItem {
    id?: number;
    name?: string;
    description?: string;
    type?: string;
    status?: string;
    assignedTo?: AssignedTo;
    tasks?: Task[];
}

export class Task {
    id?: number;
    status?: string;
    name?: string;
    assignedTo?: AssignedTo;
    description?: string;
}

export class AssignedTo {
    displayName?: string;
    pictureUrl?: string;
}

export interface WorkItemComponentState {
    workItems: WorkItem[];
    hasNeededSettings: boolean;
    isCallingApi: boolean;

}
