import React from 'react';
import './AppLayout.scss';
import {BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";
import Menu from "../menu/Menu";
import WorkItems from "../work-items/Work-items";
import Settings from "../settings/Settings";
import {SettingMode, SettingsViewModel} from "../../models/settings";
import {noop, saveSettings, toastError, toastOk} from "../../services/config-service";
import {getADOWorkItems} from "../../services/ado-service";

// Wrapped function that implements the success and error functions to make toast.  Yummy.
const saveWithToast = (theSettings: SettingsViewModel) => saveSettings(theSettings, toastOk, toastError)

// Wrapped function that implements the success and error functions to do nothing.
const saveWithNoOp = (theSettings: SettingsViewModel) => saveSettings(theSettings, noop, noop);

const AppLayout = () => {

    return (
        <Router>
            <div className="header">
                <h5>Azure Devops Work Items</h5>
                <Menu></Menu>
            </div>
            <div className="callout main">
                <div className="router-outlet">
                    <Switch>
                        <Route
                            key="1"
                            path="/work-items">
                            <WorkItems
                                getWorkItems={getADOWorkItems}
                                saveSettings={saveWithNoOp}/>
                        </Route>
                        <Route
                            key="2"
                            path="/settings/repo">
                            <Settings
                                mode={SettingMode.Repo}
                                saveSettings={saveWithToast}/>
                        </Route>
                        <Route
                            key="3"
                            path="/settings/default">
                            <Settings
                                mode={SettingMode.Default}
                                saveSettings={saveWithToast}/>
                        </Route>
                        <Redirect to="/work-items"></Redirect>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default AppLayout;
