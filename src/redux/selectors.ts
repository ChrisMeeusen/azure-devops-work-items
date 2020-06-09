import {AdoState} from "./reducer";
import {ADOSecurityContext} from "../models/ado-api";

/**
 * Get the settings to use.  Repo settings take precedence over the default or global settings.
 * @param state
 */
export const getADOSecurityContext = (state: AdoState): ADOSecurityContext => {
  const securityObj = {
      organization: notNullUndefinedWhitespace(state?.repoSettings?.organization) ? state?.repoSettings?.organization : state.defaultSettings?.organization,
      project: notNullUndefinedWhitespace(state?.repoSettings?.project) ? state?.repoSettings?.project : state?.defaultSettings?.project,
      team: notNullUndefinedWhitespace(state?.repoSettings?.team) ? state?.repoSettings?.team : state?.defaultSettings?.team,
      personalAccessToken: notNullUndefinedWhitespace(state?.repoSettings?.personalAccessToken) ? state?.repoSettings?.personalAccessToken: state?.defaultSettings?.personalAccessToken
  }  as ADOSecurityContext;

  return securityObj;
};

export const getSelectedWorkItems = (state: AdoState): any[] => rememberWorkItems(state) ? state.selectedWorkItemIds: [];

export const rememberWorkItems = (state: AdoState): boolean => state.repoSettings?.rememberWorkItems || state.defaultSettings?.rememberWorkItems as boolean;

/**
 * Do we have all the required settings to use the ADO apis?
 * @param settings
 */
export const hasRequiredSettings = (adoState: AdoState): boolean => {

    const result = (notNullUndefinedWhitespace(adoState.repoSettings?.personalAccessToken) || notNullUndefinedWhitespace(adoState.defaultSettings?.personalAccessToken))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.organization) || notNullUndefinedWhitespace(adoState.defaultSettings?.organization))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.team) || notNullUndefinedWhitespace(adoState.defaultSettings?.team))
         && (notNullUndefinedWhitespace(adoState.repoSettings?.project) || notNullUndefinedWhitespace(adoState.defaultSettings?.project));

    return result;

};

export const notNullUndefinedWhitespace = (value: any) : boolean => value !== undefined && value !== null && value?.trim() !=="";
