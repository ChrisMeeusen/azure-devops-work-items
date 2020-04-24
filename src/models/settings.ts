import {WorkItemType} from "./work-item";

export class SettingsViewModel {
    mode?: SettingMode;
    filePath?: string;
    personalAccessToken?: string;
    rememberWorkItems?: boolean;
    organization?: string;
    team?: string;
    project?: string;
    showTasks?: boolean;
    workItemTypesToQuery: WorkItemType[];
    hasBeenLoaded: boolean;
}

export enum SettingMode {
    Repo = 'Repo',
    Default = 'Default'
}

export interface SettingsComponentState {
    settings: SettingsViewModel,
    showToken: boolean,
    inclUserRequest: boolean,
    inclSupportRequest: boolean,
    inclBugs: boolean,
    showTasks: boolean,
    rememberSelectedWorkItems: boolean
}
