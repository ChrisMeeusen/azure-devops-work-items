export class SettingsViewModel {
    mode?: SettingMode;
    filePath?: string;
    personalAccessToken?: string;
    rememberLastSelectedWorkItems?: boolean;
    organization?: string;
    team?: string;
    project?: string;
}

export enum SettingMode {
    Repo = 'Repo',
    Default = 'Default'
}

