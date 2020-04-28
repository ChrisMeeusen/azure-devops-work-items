import React from 'react';
import './Settings.scss';
import {SettingMode, SettingsComponentState, SettingsViewModel} from "../../models/settings";
import {AdoState} from "../../redux/reducer";
import {connect} from "react-redux";
import {saveSettings} from "../../services/config-service";
import {saveDefaultSettings, saveRepoSettings} from "../../redux/actions";

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
            mode: settings.mode,
            filePath: settings.filePath,
            personalAccessToken: settings.personalAccessToken,
            rememberWorkItems: settings.rememberWorkItems,
            organization: settings.organization,
            team: settings.team,
            project: settings.project,
            showToken: showToken
        } as unknown as SettingsComponentState;

        this.toggleWorkItems = this.toggleWorkItems.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
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

    toggleWorkItems() {
       this.setState(prevState => ({
           rememberWorkItems: !prevState.rememberWorkItems
       }));
    }

    handleInputChange(event: any) {
        const target = event.target;
        const value = target.name === 'isGoing' ? target.checked : target.value;
        const name = target.name;

        const s = this.state;
        (s as any)[name]=value;

        this.setState(s);
    }

    componentWillReceiveProps(nextProps: any , nextContext: any): void {
        const s =  nextProps.mode === SettingMode.Default ?
            nextProps.defaultSettings as SettingsViewModel:
            nextProps.repoSettings as SettingsViewModel;

        const showToken = this.showToken(s);
        const nextState = {
            mode:s.mode,
            filePath: s.filePath,
            personalAccessToken: s.personalAccessToken,
            rememberWorkItems: s.rememberWorkItems,
            organization: s.organization,
            team: s.team,
            project: s.project,
            showToken: showToken
        };
        this.setState(nextState);
    }

    handleKeyUp  = (e: any) => {
        if (e.key === 'Enter') {
           this.formSubmit();
        }
    }

    formSubmit = () => {
        try{
            saveSettings(this.state);

            this.state.mode === SettingMode.Default
                ? this.props.dispatch(saveDefaultSettings(this.state))
                : this.props.dispatch(saveRepoSettings(this.state));

        } catch (e) {
            console.log(e);
        }
    };

    render() {

        const description = this.state?.mode === SettingMode.Default
            ? `These default settings are associated with this machine.  These are used only when they aren't overridden 
            in the repo settings.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#default" target="_blank">documentation.</a>`
            : `These settings are used for this specific git repository.  If nothing is set here then the default settings are 
            used.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#repo" target="_blank">documentation.</a>`;
        return (
            <div className="settings" onKeyUp={this.handleKeyUp}>
                <h5>{this.state?.mode} Settings</h5>
                <p dangerouslySetInnerHTML={{__html: description}}></p>
                <form>
                    <div className="callout secondary">
                        <label htmlFor="filePath">Settings Stored Here:</label>
                        <span id="filePath">{this.state?.filePath}</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pat">Personal Access Token</label>
                            <input id="pat"
                                   name="personalAccessToken"
                                   type="text"
                                   value={this.state?.personalAccessToken}
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
                                   value={this.state?.organization}
                                   onChange={this.handleInputChange}
                                   placeholder="Organization"/>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="project">Project</label>
                            <input id="project"
                                   name="project"
                                   placeholder="Project"
                                   value={this.state?.project}
                                   onChange={this.handleInputChange}
                                   type="text" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="team">Team</label>
                            <input id="team"
                                   name="team"
                                   value={this.state?.team}
                                   onChange={this.handleInputChange}
                                   placeholder="Team"
                                   type="text" />
                        </div>
                    </div>

                    <div className="form-row toggle-row">

                        <div className="control-group">
                            <div className="switch">
                                <label htmlFor="sticky-work-items">Remember Selected Work Items?</label>
                                <input checked={this.state.rememberWorkItems}
                                       onChange={this.toggleWorkItems}
                                       className="switch-input"
                                       id="sticky-work-items"
                                       type="checkbox"
                                       name="rememberWorkItems" />
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

