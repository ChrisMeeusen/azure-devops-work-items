import {SettingsViewModel} from "../models/settings";
import * as toastr from "toastr";
const fs = window.require('fs');

   export const saveSettings = (settings: SettingsViewModel, onSuccess: () => void, onError: (error: any) => void ) => {
       console.log('settings to save', settings);
       try {
           fs.writeFileSync(settings.filePath as string, JSON.stringify(settings, null, 2));
           onSuccess();
       } catch(error){
           onError(error);
           throw error;
       }
    };

    export const toastOk = (): void => {
        toastr.success("Configuration saved.", "Success",{timeOut: 3000});
    }

    export const toastError = (error?: any): void => {
        toastr.error(error, "Error", {timeOut: 3000});
    }

    export const noop = () => {

    }
