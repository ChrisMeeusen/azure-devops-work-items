import React from 'react';
import './Settings.scss';
import {SettingMode, SettingsComponentState, SettingsViewModel} from "../../models/settings";
import {AdoState} from "../../redux/reducer";
import {connect} from "react-redux";
import {saveSettings} from "../../services/config-service";
import {saveDefaultSettings, saveRepoSettings} from "../../redux/actions";
import {WorkItemType} from "../../models/work-item";

class Settings extends React.Component<
    {   mode: SettingMode | undefined,
        repoSettings: SettingsViewModel | undefined,
        defaultSettings: SettingsViewModel | undefined,
        dispatch: any
    }
        , SettingsComponentState> {

    constructor(props: any) {
        super(props);

        const settings = this.getSettingsFromProps();
        const showToken = this.showToken(settings);

        this.state = {
            settings: settings,
            showToken: showToken,
            rememberSelectedWorkItems: (settings?.rememberWorkItems as boolean) ?? false,
            showTasks: (settings?.showTasks as boolean) ?? false,
            inclBugs: settings.workItemTypesToQuery?.some(wi => wi === WorkItemType.BUG) ?? true,
            inclSupportRequest: settings.workItemTypesToQuery?.some(wi => wi === WorkItemType.SUPPORT_REQUEST) ?? true,
            inclUserRequest: settings.workItemTypesToQuery?.some(wi => wi === WorkItemType.USER_REQUEST) ?? true
        };

        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleWorkItemTypeChange = this.handleWorkItemTypeChange.bind(this);
    }

    getSettingsFromProps() {
        const settings = this.props.mode === SettingMode.Default ?
            this.props.defaultSettings as SettingsViewModel:
            this.props.repoSettings as SettingsViewModel;

        return settings;
    }

    showToken(settings: SettingsViewModel){
        return !settings?.personalAccessToken;
    }

    handleInputChange(event: any) {
        const target = event.target;
        const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;

        const s = this.state.settings;
        (s as any)[name]=value;

        this.setState({
            showToken: this.state.showToken,
            settings: s
        });
    }

    handleWorkItemTypeChange(event: any) {
        const target = event.target;

        const value = target.name;
        const isChecked = target.checked;

        const s = this.state.settings;
        s.workItemTypesToQuery = s.workItemTypesToQuery ?? [];

        if(isChecked  && !s.workItemTypesToQuery?.some(wi => wi === value)) {
            s.workItemTypesToQuery.push(value);
        } else {
            s.workItemTypesToQuery = s.workItemTypesToQuery.filter(wi => wi !== value);
        }

        const newState = {
            showToken: this.state.showToken,
            settings: s
        } as SettingsComponentState;

        switch (value) {
            case WorkItemType.USER_REQUEST:
                newState.inclUserRequest = isChecked;
            break;
            case WorkItemType.SUPPORT_REQUEST:
                newState.inclSupportRequest = isChecked;
            break;
            case WorkItemType.BUG:
                newState.inclBugs = isChecked;
            break;
        }
        this.setState(newState);
    }

    componentWillReceiveProps(nextProps: any , nextContext: any): void {
        const s =  nextProps.mode === SettingMode.Default ?
            nextProps.defaultSettings as SettingsViewModel:
            nextProps.repoSettings as SettingsViewModel;

        const showToken = this.showToken(s);
        const nextState = {
            showToken: showToken,
            settings: s,
            rememberSelectedWorkItems: (s?.rememberWorkItems as boolean) ?? false,
            showTasks: (s?.showTasks as boolean) ?? false,
            inclBugs: s.workItemTypesToQuery?.some(wi => wi === WorkItemType.BUG) ?? true,
            inclSupportRequest: s.workItemTypesToQuery?.some(wi => wi === WorkItemType.SUPPORT_REQUEST) ?? true,
            inclUserRequest: s.workItemTypesToQuery?.some(wi => wi === WorkItemType.USER_REQUEST) ?? true
        };
        console.log('next props', nextProps);
        console.log('next state', nextState);
        this.setState(nextState);
    }

    handleKeyUp  = (e: any) => {
        if (e.key === 'Enter') {
           this.formSubmit();
        }
    }

    formSubmit = () => {
        try{
            this.state.settings.workItemTypesToQuery = this.state.settings.workItemTypesToQuery ?? [];
            if(this.state?.inclBugs && !this.state?.settings?.workItemTypesToQuery?.some(wi => wi === WorkItemType.BUG)){
                this.state.settings.workItemTypesToQuery.push(WorkItemType.BUG);
            }
            if(this.state?.inclSupportRequest && !this.state?.settings?.workItemTypesToQuery?.some(wi => wi === WorkItemType.SUPPORT_REQUEST)){
                this.state.settings.workItemTypesToQuery.push(WorkItemType.SUPPORT_REQUEST);
            }
            if(this.state?.inclUserRequest && !this.state?.settings?.workItemTypesToQuery?.some(wi => wi === WorkItemType.USER_REQUEST)) {
                this.state.settings.workItemTypesToQuery.push(WorkItemType.USER_REQUEST);
            }
            saveSettings(this.state.settings);

            this.state.settings.mode === SettingMode.Default
                ? this.props.dispatch(saveDefaultSettings(this.state.settings))
                : this.props.dispatch(saveRepoSettings(this.state.settings));

        } catch (e) {
            console.log(e);
        }
    };

    render() {

        const description = this.state.settings?.mode === SettingMode.Default
            ? `These default settings are associated with this machine.  These are used only when they aren't overridden 
            in the repo settings.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#default" target="_blank">documentation.</a>`
            : `These settings are used for this specific git repository.  If nothing is set here then the default settings are 
            used.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#repo" target="_blank">documentation.</a>`;
        return (
            <div className="settings" onKeyUp={this.handleKeyUp}>
                <h5>{this.state.settings?.mode} Settings</h5>
                <p dangerouslySetInnerHTML={{__html: description}}></p>
                <form>
                    <div className="callout secondary">
                        <label htmlFor="filePath">Settings Stored Here:</label>
                        <span id="filePath">{this.state.settings?.filePath}</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pat">Personal Access Token</label>
                            <input id="pat"
                                   name="personalAccessToken"
                                   type="text"
                                   value={this.state.settings?.personalAccessToken}
                                   onChange={this.handleInputChange}
                                   placeholder="Personal Access Token"/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="org">Organization</label>
                            <input id="org"
                                   name="organization"
                                   type="text"
                                   value={this.state.settings?.organization}
                                   onChange={this.handleInputChange}
                                   placeholder="Organization"/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="team">Team</label>
                            <input id="team"
                                   name="team"
                                   value={this.state.settings?.team}
                                   onChange={this.handleInputChange}
                                   placeholder="Team"
                                   type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="project">Project</label>
                            <input id="project"
                                   name="project"
                                   placeholder="Project"
                                   value={this.state.settings?.project}
                                   onChange={this.handleInputChange}
                                   type="text" />
                        </div>
                    </div>

                    <div className="form-row toggle-row">

                        <div className="control-group fs">
                            <fieldset className="fieldset">
                                <legend>Work Item Types</legend>
                                <input checked={this.state.inclUserRequest}
                                       onChange={this.handleWorkItemTypeChange}
                                       name={WorkItemType.USER_REQUEST}
                                       id="ur-chx-box" type="checkbox"/><label htmlFor="ur-chx-box">User Requests</label>
                                <input checked={this.state.inclSupportRequest}
                                       onChange={this.handleWorkItemTypeChange}
                                       name={WorkItemType.SUPPORT_REQUEST}
                                       id="sr-chx-box" type="checkbox"/><label htmlFor="sr-chx-box">Support Requests</label>
                                <input checked={this.state.inclBugs}
                                       onChange={this.handleWorkItemTypeChange}
                                       name={WorkItemType.BUG}
                                       id="bg-chx-box" type="checkbox"/><label htmlFor="bg-chx-box">Bugs</label>
                            </fieldset>
                        </div>

                        <div className="control-group">
                            <div className="switch">
                                <label htmlFor="show-tasks">Show Tasks?</label>
                                <input className="switch-input" id="show-tasks" type="checkbox" name="showTasks" />
                                <label className="switch-paddle" htmlFor="show-tasks" >
                                    <span className="switch-active" aria-hidden="true">Yes</span>
                                    <span className="switch-inactive" aria-hidden="true">No</span>
                                </label>
                            </div>
                        </div>

                        <div className="control-group">
                            <div className="switch">
                                <label htmlFor="sticky-work-items">Remember Selected Work Items?</label>
                                <input className="switch-input" id="sticky-work-items" type="checkbox" name="rememberWorkItems" />
                                <label className="switch-paddle" htmlFor="sticky-work-items" >
                                    <span className="switch-active" aria-hidden="true">Yes</span>
                                    <span className="switch-inactive" aria-hidden="true">No</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className="button-row">
                        <button
                            onClick={this.formSubmit}
                            className="button"
                            type="button">Save</button>
                    </div>
                </form>
            </div>
        );
    }
}

const select = (appState: AdoState) => {
    return {
        repoSettings: appState?.repoSettings,
        defaultSettings: appState?.defaultSettings
    };
};

export default connect(select)(Settings);

