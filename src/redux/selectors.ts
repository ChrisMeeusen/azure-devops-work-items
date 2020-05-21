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

export const rememberWorkItems = (state: AdoState): boolean => state.repoSettings?.rememberWorkItems || state.defaultSettings?.rememberWorkItems as boolean;

/**
 * Do we have all the required settings to use the ADO apis?
 * @param settings
 */
export const hasRequiredSettings = (adoState: AdoState): boolean => {
     return (notNullUndefinedWhitespace(adoState.repoSettings?.personalAccessToken) || notNullUndefinedWhitespace(adoState.defaultSettings?.personalAccessToken))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.organization) || notNullUndefinedWhitespace(adoState.defaultSettings?.organization))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.team) || notNullUndefinedWhitespace(adoState.defaultSettings?.team))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.project) || notNullUndefinedWhitespace(adoState.repoSettings?.project));

};

export const notNullUndefinedWhitespace = (value: any) : boolean => value !== undefined && value !== null && value?.trim() !=="";
