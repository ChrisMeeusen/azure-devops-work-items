import {
    ADOSecurityContext,
    GetBatchWorkItemsRequest, GetBatchWorkItemsResponse, Value,
    WorkItemQueryRequest,
    WorkItemQueryResponse,
    WorkItemRelation
} from "../models/ado-api";
import {Task, WorkItem} from "../models/work-item";


export const getADOWorkItems = async (adoSecurity: ADOSecurityContext): Promise<WorkItem[]> => {
    const security = getBasicAuthHeader(adoSecurity);
    const content = getContentTypeHeader();
    const headers = {...security, ...content};
    const wiQuery = getWorkItemQuery(adoSecurity);
    const wiUrl = `https://dev.azure.com/${adoSecurity.organization}/${adoSecurity.project}/${adoSecurity.team}/_apis/wit/wiql?api-version=5.1`;
    const wiFetchResponse = await fetch( wiUrl,{ method:'POST', headers: new Headers(headers), body: JSON.stringify(wiQuery) });
    const wiResponse = (await wiFetchResponse.json()) as WorkItemQueryResponse;

    const queryIds = getUniqueIds(wiResponse);
    const batchItemRequest = getBatchWorkItemsRequest(queryIds);
    const wiBatchUrl = `https://dev.azure.com/${adoSecurity.organization}/${adoSecurity.project}/_apis/wit/workitemsbatch/?api-version=5.1`;
    const wiBatchFetchResponse = await fetch( wiBatchUrl,{ method:'POST', headers: new Headers(headers), body: JSON.stringify(batchItemRequest) });
    const wiBatchResponse = (await wiBatchFetchResponse.json()) as GetBatchWorkItemsResponse;

    const workItems = mergeApiResponses(wiResponse, wiBatchResponse);
    console.log(workItems);
    return workItems;
};

const getBasicAuthHeader = (adoSecurity: ADOSecurityContext): any => {
    const authStrVal = `:${adoSecurity.personalAccessToken}`;
    return {"Authorization": `Basic ${new Buffer(authStrVal).toString('base64')}`};
}

const getContentTypeHeader = (): any => {
    return {"Content-Type":"application/json"};
}

const getWorkItemQuery = (adoSecurity: ADOSecurityContext): WorkItemQueryRequest => {
    return { query: `SELECT [System.Id], [System.WorkItemType], [System.Title], [System.AssignedTo], [System.State], [System.Tags] FROM workitemLinks WHERE ( [Source].[System.TeamProject] = @project AND [Source].[System.WorkItemType] <> 'Task' AND [Source].[System.State] <> '' AND [Source].[System.IterationPath] = @currentIteration('[${adoSecurity.project}]\\${adoSecurity.team}')) AND ([Target].[System.TeamProject] = @project AND [Target].[System.WorkItemType] <> '' ) ORDER BY [System.Id] MODE (MayContain)`} as WorkItemQueryRequest;
}

const getUniqueIds = (wir: WorkItemQueryResponse ): number[] => {

    const targetIds = wir?.workItemRelations?.map((item: WorkItemRelation) => item?.target?.id);
    const sourceIds = wir?.workItemRelations?.map((item: WorkItemRelation) => item?.source?.id);
    let uniqs = Array.from( new Set([...targetIds, ...sourceIds]));

    uniqs = uniqs.filter(Boolean);
    return uniqs;
}

const getBatchWorkItemsRequest = (ids: number[]) : GetBatchWorkItemsRequest => {
    return {
        ids: ids,
        fields:[
            "System.Id",
            "System.Title",
            "System.WorkItemType",
            "Microsoft.VSTS.Scheduling.RemainingWork",
            "System.AssignedTo",
            "System.State",
            "System.Tags",
            "System.Description"
        ]
    } as GetBatchWorkItemsRequest;
};

const mergeApiResponses = (wiqr: WorkItemQueryResponse, gbwir :GetBatchWorkItemsResponse): WorkItem[] => {
    /**
     * Filter map inception to parse through the two Ado api responses.  I kinda hate this code but am not sure
     * how to make it much better...
     */
    const items = wiqr.workItemRelations
        .filter((wir: WorkItemRelation) => !wir.source)
        .map((wir:WorkItemRelation) => {

            const wi = gbwir.value.find((wi: Value) => wi.id === wir.target.id);
            const anItem = {
                id:wir.target.id,
                assignedTo: { displayName: wi?.fields["System.AssignedTo"]?.displayName, pictureUrl: wi?.fields["System.AssignedTo"]?._links?.avatar?.href },
                description: wi?.fields["System.Description"],
                name: wi?.fields["System.Title"],
                status: wi?.fields["System.State"],
                type: wi?.fields["System.WorkItemType"],
                tasks: wiqr.workItemRelations
                    .filter((wir2:WorkItemRelation) => wir2?.source?.id === wir.target.id)
                    .map((wir2: WorkItemRelation) => {
                        const wi = gbwir.value.find((wi: Value) => wi.id === wir2.target.id);
                        const aTask = {
                            id: wir2?.target?.id,
                            assignedTo: { displayName: wi?.fields["System.AssignedTo"]?.displayName, pictureUrl: wi?.fields["System.AssignedTo"]?._links?.avatar?.href },
                            name: wi?.fields["System.Title"],
                            status: wi?.fields["System.State"],
                            description: wi?.fields["System.Description"]
                        } as Task;
                        return aTask;
                    })
            };
            return anItem;
        });
    return items;
}
