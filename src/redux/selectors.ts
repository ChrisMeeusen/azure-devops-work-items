import {AdoState} from "./reducer";
import {ADOSecurityContext} from "../models/ado-api";

/**
 * Get the settings to use.  Repo settings take precedence over the default or global settings.
 * @param state
 */
export const getADOSecurityContext = (state: AdoState): ADOSecurityContext => {
  return {
      organization: state?.repoSettings?.organization ?? state.defaultSettings?.organization,
      project: state?.repoSettings?.project ?? state?.defaultSettings?.project,
      team: state?.repoSettings?.team ?? state?.defaultSettings?.team,
      personalAccessToken: state?.repoSettings?.personalAccessToken ?? state?.defaultSettings?.personalAccessToken
  }  as ADOSecurityContext
};

export const getSelectedWorkItems = (state: AdoState): any[] => rememberWorkItems(state) ? state.selectedWorkItemIds: [];

export const rememberWorkItems = (state: AdoState): boolean => state.repoSettings?.rememberWorkItems ?? state.defaultSettings?.rememberWorkItems as boolean;

/**
 * Do we have all the required settings to use the ADO apis?
 * @param settings
 */
export const hasRequiredSettings = (securityContext: ADOSecurityContext): boolean => {
     return !!(securityContext.personalAccessToken && securityContext.organization
         && securityContext.project && securityContext.team);
};
