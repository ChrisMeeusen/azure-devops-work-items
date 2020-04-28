import {WorkItemType} from "./work-item";

export class SettingsViewModel {
    mode?: SettingMode;
    filePath?: string;
    personalAccessToken?: string;
    rememberWorkItems?: boolean;
    organization?: string;
    team?: string;
    project?: string;
}

export enum SettingMode {
    Repo = 'Repo',
    Default = 'Default'
}

/*
export interface SettingsComponentState {
    settings: SettingsViewModel,
    showToken: boolean,
    rememberSelectedWorkItems: boolean
}*/

export class SettingsComponentState extends SettingsViewModel {
    showToken: boolean
}
