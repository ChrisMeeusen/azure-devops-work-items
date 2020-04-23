import {SettingsViewModel} from "../models/settings";
import * as toastr from "toastr";
const fs = window.require('fs');

   export const saveSettings = (settings: SettingsViewModel) => {
       console.log('settings to save', settings);
       try {
           fs.writeFileSync(settings.filePath as string, JSON.stringify(settings, null, 2));
           toastOk();
       } catch(error){
           toastError(error);
           throw error;
       }

    };

    const toastOk = () => {
        toastr.success("Configuration saved.", "Success",{timeOut: 3000});
    }

    const toastError = (error: any) => {
        toastr.error(error, "Error", {timeOut: 3000});
    }
