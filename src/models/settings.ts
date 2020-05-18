
export class SettingsViewModel {
    mode?: SettingMode;
    filePath?: string;
    personalAccessToken?: string;
    rememberWorkItems?: boolean;
    organization?: string;
    team?: string;
    project?: string;
    hasBeenLoaded?:boolean;
    selectedWorkItems:  any [];
}

export enum SettingMode {
    Repo = 'Repo',
    Default = 'Default'
}

export class SettingsComponentState extends SettingsViewModel {
    showToken: boolean
}
