export interface Column {
    referenceName: string;
    name: string;
    url: string;
}

export interface Field {
    referenceName: string;
    name: string;
    url: string;
}

export interface SortColumn {
    field: Field;
    descending: boolean;
}

export interface Source {
    id: number;
    url: string;
}

export interface Target {
    id: number;
    url: string;
}

export interface WorkItemRelation {
    rel: string;
    source: Source;
    target: Target;
}

export interface WorkItemQueryResponse {
    queryType: string;
    queryResultType: string;
    asOf: Date;
    columns: Column[];
    sortColumns: SortColumn[];
    workItemRelations: WorkItemRelation[];
}

export interface WorkItemQueryRequest {
    query: string;
}

// TODO here starts Work Item
export interface Avatar {
    href: string;
}

export interface Links {
    avatar: Avatar;
}

export interface SystemCreatedBy {
    displayName: string;
    url: string;
    _links: Links;
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
}

export interface Avatar2 {
    href: string;
}

export interface Links2 {
    avatar: Avatar2;
}

export interface SystemChangedBy {
    displayName: string;
    url: string;
    _links: Links2;
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
}

export interface Fields {
    'System.AreaPath': string;
    'System.TeamProject': string;
    'System.IterationPath': string;
    'System.WorkItemType': string;
    'System.State': string;
    'System.Reason': string;
    'System.CreatedDate': Date;
    'System.CreatedBy': SystemCreatedBy;
    'System.ChangedDate': Date;
    'System.ChangedBy': SystemChangedBy;
    'System.CommentCount': number;
    'System.Title': string;
    'System.BoardColumn': string;
    'System.BoardColumnDone': boolean;
    'Microsoft.VSTS.Common.StateChangeDate': Date;
    'Microsoft.VSTS.Common.Priority': number;
    'Microsoft.VSTS.Common.StackRank': number;
    'Microsoft.VSTS.Common.ValueArea': string;
    'WEF_40F08508636C4414A091359A06DFD142_Kanban.Column': string;
    'WEF_40F08508636C4414A091359A06DFD142_Kanban.Column.Done': boolean;
}

export interface Self {
    href: string;
}

export interface WorkItemUpdates {
    href: string;
}

export interface WorkItemRevisions {
    href: string;
}

export interface WorkItemComments {
    href: string;
}

export interface Html {
    href: string;
}

export interface WorkItemType {
    href: string;
}

export interface Fields2 {
    href: string;
}

export interface Links3 {
    self: Self;
    workItemUpdates: WorkItemUpdates;
    workItemRevisions: WorkItemRevisions;
    workItemComments: WorkItemComments;
    html: Html;
    workItemType: WorkItemType;
    fields: Fields2;
}

export interface GetWorkItemResponse {
    id: number;
    rev: number;
    fields: Fields;
    _links: Links3;
    url: string;
}
