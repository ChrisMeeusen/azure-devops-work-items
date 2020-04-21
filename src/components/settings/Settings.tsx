import React from 'react';
import './Settings.scss';
import {SettingMode, SettingsViewModel} from "../../models/settings";

class Settings extends React.Component<{ settings: SettingsViewModel }> {

    render() {

        const {settings} = this.props;
        const description = settings.mode === SettingMode.Default
            ? `These default settings are associated with this machine.  These are used only when they aren't overridden 
            in the repo settings.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#default" target="_blank">documentation.</a>`
            : `These settings are used for this specific git repository.  If nothing is set here then the default settings are 
            used.  For more information see the <a href="https://github.com/ChrisMeeusen/azure-devops-work-items#repo" target="_blank">documentation.</a>`;
        return (
            <div>
                <h5>{settings.mode} Settings</h5>
                <p dangerouslySetInnerHTML={{__html: description}}></p>
                <form>
                    <div className="callout secondary">
                        <label htmlFor="filePath">Settings Stored Here:</label>
                        <span id="filePath">C:\app_data\conf.json</span>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="pat">Personal Access Token</label>
                            <input id="pat" type="text" />
                        </div>
                        <div className="form-group link">
                            <a rel="noopener noreferrer"
                               target="_blank"
                               href="https://github.com/ChrisMeeusen/azure-devops-work-items#pat"
                            >What's this?</a>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="org">Organization</label>
                            <input id="org" type="text" />
                        </div>
                        <div className="form-group link">
                            <a rel="noopener noreferrer"
                               target="_blank"
                               href="https://github.com/ChrisMeeusen/azure-devops-work-items#org"
                            >What's this?</a>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="team">Team</label>
                            <input id="team" type="text" />
                        </div>
                        <div className="form-group link">
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://github.com/ChrisMeeusen/azure-devops-work-items#team"
                            >What's this?</a>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="project">Project</label>
                            <input id="project" type="text" />
                        </div>
                        <div className="form-group link">
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://github.com/ChrisMeeusen/azure-devops-work-items#project"
                            >What's this?</a>
                        </div>
                    </div>

                    <div className="form-row switch-row">
                        <div className="form-group-switch">
                            <div className="switch">
                                <label htmlFor="sticky-work-items">Remember Selected Work Items?</label>
                                <input className="switch-input" id="sticky-work-items" type="checkbox" name="exampleSwitch" />
                                <label className="switch-paddle" htmlFor="sticky-work-items" >
                                    <span className="switch-active" aria-hidden="true">Yes</span>
                                    <span className="switch-inactive" aria-hidden="true">No</span>
                                </label>
                            </div>
                        </div>
                        <div className="form-group link">
                            <a
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://github.com/ChrisMeeusen/azure-devops-work-items#remeberWI"
                            >What's this?</a>
                        </div>
                    </div>
                    <div className="button-row">
                        <button className="button" type={"submit"}>Save</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Settings;
