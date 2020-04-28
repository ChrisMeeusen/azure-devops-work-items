import {ADOSecurityContext} from "../models/ado-api";
import {WorkItem} from "../models/work-item";


const workItemQuery = `SELECT 
    [System.Id], [System.WorkItemType], [System.Title], [System.AssignedTo], [System.State], [System.Tags] 
    FROM workitemLinks 
    WHERE ( [Source].[System.TeamProject] = @project AND [Source].[System.WorkItemType] <> 'Task'
        AND [Source].[System.State] <> '' 
        AND [Source].[System.IterationPath] = @currentIteration('[Red Kitten Matrix]\\\\Red Kitten Matrix Team'))
        AND ([Target].[System.TeamProject] = @project
        AND [Target].[System.WorkItemType] <> '' ) ORDER BY [System.Id] MODE (MayContain)`;

export const getADOWorkItems = async (adoSecurity: ADOSecurityContext): Promise<WorkItem[]> => {
    const security = getBasicAuthHeader(adoSecurity);
    const content = getContentTypeHeader();
    const headers = {...security, ...content};
    const wiQuery = getWorkItemQuery(adoSecurity);


    return [];
};

const getBasicAuthHeader = (adoSecurity: ADOSecurityContext): any => {
    return {"Authorization": `Basic ${new Buffer(adoSecurity.personalAccessToken).toString('base64')}`};
}

const getContentTypeHeader = (): any => {
    return {"Content-Type":"application/json"};
}

const getWorkItemQuery = (adoSecurity: ADOSecurityContext): string => {
    return `SELECT 
    [System.Id], [System.WorkItemType], [System.Title], [System.AssignedTo], [System.State], [System.Tags] 
    FROM workitemLinks 
    WHERE ( [Source].[System.TeamProject] = @project AND [Source].[System.WorkItemType] <> 'Task'
        AND [Source].[System.State] <> '' 
        AND [Source].[System.IterationPath] = @currentIteration('${adoSecurity.project}\\${adoSecurity.team}'))
        AND ([Target].[System.TeamProject] = @project
        AND [Target].[System.WorkItemType] <> '' ) ORDER BY [System.Id] MODE (MayContain)`;
}
