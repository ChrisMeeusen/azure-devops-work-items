

export class ADOApiRequest {
    security: ADOSecurityContext;
}


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

export class WorkItemQueryRequest extends  ADOApiRequest {
    query: string;
}

export interface ADOSecurityContext {
    personalAccessToken: string;
    organization: string;
    project: string;
    team: string;
}

// TODO here starts Work Item
export interface Avatar {
    href: string;
}

export interface Links {
    avatar: Avatar;
}

export interface SystemAssignedTo {
    displayName: string;
    url: string;
    _links: Links;
    id: string;
    uniqueName: string;
    imageUrl: string;
    descriptor: string;
}

export interface Fields {
    "System.Id": number;
    "System.WorkItemType": string;
    "System.State": string;
    "System.AssignedTo": SystemAssignedTo;
    "System.Title": string;
    "System.Description": string;
}

export interface CommentVersionRef {
    commentId: number;
    version: number;
    url: string;
}

export interface Value {
    id: number;
    rev: number;
    fields: Fields;
    url: string;
    commentVersionRef: CommentVersionRef;
}

export interface GetBatchWorkItemsResponse {
    count: number;
    value: Value[];
}

export class GetBatchWorkItemsRequest extends ADOApiRequest{
  ids: number[];
  fields: string[];
}
