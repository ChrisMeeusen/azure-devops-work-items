import React from 'react';
import './App.scss';
import 'jquery';
import 'foundation-sites/js/foundation.core';
import AppLayout from "./components/app-layout/AppLayout";
import {saveDefaultSettings, saveRepoSettings} from "./redux/actions";
import {SettingsViewModel} from "./models/settings";
import {connect} from "react-redux";
const ipc = window.require("electron").ipcRenderer;

class App extends React.Component<any, any>{
  constructor(props: any) {
    super(props);

    /**
     * This is an event listener to receive the config data from the electron main process (public/electron.js).
     */
    ipc.on('conf-read', function(event :any, args: any){

      const repoSettings = args[0] as SettingsViewModel;
      const defaultSettings = args[1] as SettingsViewModel;

      repoSettings.hasBeenLoaded=true;
      defaultSettings.hasBeenLoaded=true;

      props.dispatch(saveRepoSettings(repoSettings));
      props.dispatch(saveDefaultSettings(defaultSettings));
    });

    /**
     * Tell electron that the react app is up and running and ready to receive the config data in the above
     * event listener.
     */
    ipc.send('react-loaded', {});

    this.onAppKeyUp = this.onAppKeyUp.bind(this);
  }

  componentDidMount(): void {
    document.addEventListener("keyup", this.onAppKeyUp, false);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keyup", this.onAppKeyUp, false);
  }

  onAppKeyUp = (event: any) => {
    if(event.key ==='Escape'){
      ipc.send('quit-app');
    }
  }

  render() {
    return (
        <div className="app">
          <AppLayout />
        </div>
    );
  }

}

export default connect()(App);
