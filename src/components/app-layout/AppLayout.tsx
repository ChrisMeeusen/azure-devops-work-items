import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Menu from "../menu/Menu";
import WorkItems from "../work-items/Work-items";
import Settings from "../settings/Settings";
import {SettingMode, SettingsViewModel} from "../../models/settings";
const ipc = window.require("electron").ipcRenderer;

const AppLayout = () => {

    const repoSettings = { mode: SettingMode.Repo} as SettingsViewModel;
    const defaultSettings = { mode: SettingMode.Default} as SettingsViewModel;

    debugger;

    ipc.on('conf-read', ((event :any, args: any) => {
        console.log('conf-read', args);
    }));

    debugger;
    ipc.send('react-loaded', {});

    return (
        <Router>
            <div className="callout">
                <h5>Azure Devops Browse</h5>
                <Menu></Menu>
                <div className="callout router-outlet">
                    <Switch>
                        <Route path="/work-items">
                            <WorkItems />
                        </Route>
                        <Route path="/settings/repo">
                            <Settings settings={ repoSettings }/>
                        </Route>
                        <Route path="/settings/default">
                            <Settings settings={ defaultSettings }/>
                        </Route>
                        <Redirect to="/work-items"></Redirect>
                    </Switch>
                </div>
            </div>

        </Router>
    );
}

export default AppLayout;
