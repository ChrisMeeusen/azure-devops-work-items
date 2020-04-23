export class WorkItem {
    id: string;
    name: string;
    description: string;
    type: WorkItemType;
}

export enum WorkItemType {
    BUG = 'Bug',
    SUPPORT_REQUEST = 'Support Request',
    USER_REQUEST = 'User Request'
}
