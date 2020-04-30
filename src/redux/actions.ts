import {SettingsViewModel} from "../models/settings";
import {WorkItem} from "../models/work-item";
import {ADOSecurityContext} from "../models/ado-api";

export const SAVE_REPO_SETTINGS = 'SAVE_REPO_SETTINGS';
export const SAVE_DEFAULT_SETTINGS = 'SAVE_DEFAULT_SETTINGS'

export const GET_WORK_ITEMS = 'GET_WORK_ITEMS';
export const GET_WORK_ITEMS_SUCCESS = 'GET_WORK_ITEMS_SUCCESS';
export const GET_WORK_ITEMS_ERROR = 'GET_WORK_ITEMS_ERROR';


export const saveRepoSettings = (settings : SettingsViewModel) => {
    return { type: SAVE_REPO_SETTINGS, settings }
}

export const saveDefaultSettings = (settings: SettingsViewModel) => {
    return { type: SAVE_DEFAULT_SETTINGS, settings }
}

export const getWorkItems = (securityContext: ADOSecurityContext) => {
    return { type: GET_WORK_ITEMS, securityContext }
}

export const getWorkItemsSuccess = (workItems: WorkItem[]) => {
    return { type: GET_WORK_ITEMS_SUCCESS, workItems }
}

export const getWorkItemsError = (error: any) => {
    return { type: GET_WORK_ITEMS_ERROR, error }
}
