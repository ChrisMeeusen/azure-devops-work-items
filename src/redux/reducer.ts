import {WorkItem} from "../models/work-item";
import {SettingMode, SettingsViewModel} from "../models/settings";
import {
    CLEAR_SELECTED_WORK_ITEMS,
    GET_WORK_ITEMS,
    GET_WORK_ITEMS_ERROR,
    GET_WORK_ITEMS_SUCCESS,
    SAVE_DEFAULT_SETTINGS,
    SAVE_REPO_SETTINGS, TOGGLE_SELECTED_WORK_ITEM
} from "./actions";
import {rememberWorkItems} from "./selectors";

export const emptyRS = {
    personalAccessToken:'',
    filePath:'',
    organization:'',
    project:'',
    rememberWorkItems:false,
    team:'',
    hasBeenLoaded: false,
    mode: SettingMode.Repo
} as SettingsViewModel;

export const emptyDS = {
    personalAccessToken:'',
    filePath:'',
    organization:'',
    project:'',
    rememberWorkItems:false,
    team:'',
    hasBeenLoaded: false,
    mode: SettingMode.Default
} as SettingsViewModel;

export interface AdoState {
    error?: any,
    workItems?: WorkItem[] | null,
    repoSettings?: SettingsViewModel | null,
    defaultSettings?: SettingsViewModel | null
    bothSettingsLoaded: boolean,
    selectedWorkItemIds: any[]
}

export const initialState : AdoState = {
    error: '',
    workItems: [] as WorkItem[],
    repoSettings: emptyRS,
    defaultSettings: emptyDS,
    bothSettingsLoaded: false,
    selectedWorkItemIds:[]
}

export const adoReducer = (state: AdoState = initialState, action: any) => {
    switch(action.type) {
        case SAVE_REPO_SETTINGS:
            return {
                ...state,
                repoSettings: action.settings,
                bothSettingsLoaded: (state.defaultSettings?.hasBeenLoaded && action?.settings?.hasBeenLoaded),
                selectedWorkItemIds: (state.repoSettings?.selectedWorkItems as any[]) ?? []
            };
        case SAVE_DEFAULT_SETTINGS:
            return {
                ...state,
                defaultSettings: action.settings,
                bothSettingsLoaded: (state.repoSettings?.hasBeenLoaded && action?.settings?.hasBeenLoaded)
            };
        case GET_WORK_ITEMS:
            return state;
        case GET_WORK_ITEMS_SUCCESS:
            return {...state, workItems: action.workItems};
        case GET_WORK_ITEMS_ERROR:
            return {...state, error: action.error};
        case TOGGLE_SELECTED_WORK_ITEM:
            return {...state, selectedWorkItemIds: addOrRemove(state.selectedWorkItemIds, action.workItemId)}
        case CLEAR_SELECTED_WORK_ITEMS:
            return {...state, selectedWorkItemIds:[]}
        default:
            return state;

    }
}

const addOrRemove = (arr: any [], item: any) => arr.includes(item) ? arr.filter(i => i !== item) : [ ...arr, item ];
