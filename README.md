## Azure Devops Work Items

### Table of Conents:
* [Description](#description)
* [Installation](#install)
* [Settings](#settings)
  * [Personal Access Token](#pat)
  * [Organization](#org)
  * [Team](#team)
  * [Project](#project)
  * [Remember Selected Work Items?](#remember-work-items)
* [Developer/Contributor Information](#contribute)


<a name="description" />

#### Description
The purpose of this package is to provide you with a commit git hook that will conveniently show you a list of work items 
that are in your team's current sprint.  This package contains windows, mac, and linux binaries for the git hook (**currently the linux hook and binary is untested**).  For more information you can watch this [video](https://www.youtube.com/watch?v=Q0S_y1PKb8A).

<a name="install"/>

#### Install
The first time you use this hook on a machine you must first install the package globally.  To do so run this: ```npm i -g azure-devops-work-items```

Once the package is installed, you can run this from the root of your git repo (the same directory that contains the .git folder)

```ado-hook```

If the install was successful you'll see this message:

```Success:  git hook added to this repo!  For more information see here: https://github.com/ChrisMeeusen/azure-devops-work-items```

You only need to install this package globally once, but if you want to use it in several git repos, you'll need to repeat the ```ado-hook``` command once in each git repo you want integrated.


<a name="settings" />

#### Settings
There is a little setup required the first time you use this hook, but once you input your settings the hook will store them and use them 
in all future runs.  Default and Repo are the two setting types.  Repo settings take precedence over default settings. Default settings are like global settings.  A particular default setting value will be used
if it isn't overridden by a repo setting. 

<a name="pat" />

##### Personal Access Token
Personal Access Tokens are tokens created in Azure Devops (ADO) and are used to integrate third part tools.  The hook uses the Personal Access Token to retrieve work item 
information from ADO.  You'll need to generate a token for this tool that has the read work items scope.  That is the one and only scope required. More information on [Personal Access Tokens](https://docs.microsoft.com/en-us/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate?view=azure-devops&tabs=preview-page "Microsoft Documentation on PAT")


<a name="org" />

##### Organization
The organization associated with your team.

<a name="project" />

##### Project
The project associated with your team.

<a name="team" />

##### Team
Your team name.


<a name="remember-work-items" />

##### Remember Selected Work Items?
Do you want the hook to remember your selected work items?

<a name="contrib" />

##### Contributor Information

