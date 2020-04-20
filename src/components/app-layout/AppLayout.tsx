import React from 'react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Menu from "../menu/Menu";
import WorkItems from "../work-items/Work-items";
import Settings from "../settings/Settings";
import {SettingMode, SettingsViewModel} from "../../models/settings";

const AppLayout = () => {

    const repoSettings = { mode: SettingMode.Repo} as SettingsViewModel;
    const defaultSettings = { mode: SettingMode.Default} as SettingsViewModel;

    return (
        <Router>
            <div className="callout">
                <h5>Azure Devops Browse</h5>
                <p>This app will allow you to browse your Azure Devops work items.</p>
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
                        <Route component={WorkItems}/>
                    </Switch>
                </div>
            </div>

        </Router>
    );
}

export default AppLayout;
