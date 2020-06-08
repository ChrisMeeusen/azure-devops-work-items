import React from 'react';
import {connect} from "react-redux";
import './Work-items.scss';
import {AdoState} from "../../redux/reducer";
import {ADOSecurityContext} from "../../models/ado-api";
import {
    getADOSecurityContext,
    getSelectedWorkItems,
    hasRequiredSettings,
    rememberWorkItems
} from "../../redux/selectors";
import {AssignedTo, Task, WorkItem, WorkItemComponentState} from "../../models/work-item";
import Loader from "../loading/Loader";
import {
    clearSelectedWorkItems, clearWorkItems,
    getWorkItems,
    getWorkItemsError,
    getWorkItemsSuccess, saveRepoSettings,
    toggleWorkItemSelected
} from "../../redux/actions";
import toastr from "toastr";
import {bug, supportRequest, userStory} from "../../models/icons";
import {groupBy} from "../../utils/array-utils";
import {SettingsViewModel} from "../../models/settings";
import { Redirect } from 'react-router-dom';
const ipc = window.require("electron").ipcRenderer;

class WorkItems extends React.Component<
    {
        adoSecurity: ADOSecurityContext,
        settingsLoaded: boolean,
        dispatch: any,
        workItems: WorkItem[],
        selectWorkItems: any[],
        repoSettings: SettingsViewModel,
        defaultSettings: SettingsViewModel,
        rememberWorkItems: boolean,
        hasRequiredSettings: boolean,
        getWorkItems(adoSecurity: ADOSecurityContext): Promise<WorkItem[]>,
        saveSettings(settings: SettingsViewModel): void,
        appendCommitMessage(filePath: string, workItemString: string): void
    }, WorkItemComponentState>{

    constructor(props: any) {
        super(props);

        this.state = {
            hasNeededSettings: this.props.hasRequiredSettings,
            workItems: [],
            isCallingApi: false,
            openWorkItems:[],
            selectedWorkItems: this.props.selectWorkItems,
            searchText:''
        } as WorkItemComponentState;

        this.props.dispatch(clearWorkItems());

        this.toggleWi = this.toggleWi.bind(this);
        this.toggleWorkItemSelected = this.toggleWorkItemSelected.bind(this);
        this.workItemIsChecked = this.workItemIsChecked.bind(this);
        this.renderSelectedTasks = this.renderSelectedTasks.bind(this);
        this.renderWorkItemTypeIcon = this.renderWorkItemTypeIcon.bind(this);
        this.filterWorkItems = this.filterWorkItems.bind(this);
        this.renderSelectedWorkItems = this.renderSelectedWorkItems.bind(this);
        this.onAppKeyUp = this.onAppKeyUp.bind(this);
        this.quitAppSendSelectedItems = this.quitAppSendSelectedItems.bind(this);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if(prevProps.settingsLoaded !== this.props.settingsLoaded && prevProps.settingsLoaded === false && this.state.hasNeededSettings) {
            this.getWorkItemsFromApi();
        }
    }

    getWorkItemsFromApi() {
        this.setState(prevState => ({
            isCallingApi: true
        }));

        this.props.dispatch(getWorkItems(this.props.adoSecurity));
        this.props
            .getWorkItems(this.props.adoSecurity)
            .then(wi => {
                this.props.dispatch(getWorkItemsSuccess(wi));
                this.setState(prevState => ({
                    isCallingApi: false
                }));
            })
            .catch(error => {
                this.toastTheError(error);
                this.props.dispatch(getWorkItemsError(error));
                this.setState(prevState => ({
                    isCallingApi: false
                }));
            });
    }

    componentWillReceiveProps(nextProps: any , nextContext: any): void {
        const filteredItems = this.props.workItems.filter(wi => this.searchForValue(wi, this.state.searchText));
        this.setState(prevState => ({
            workItems: this.state.searchText ? filteredItems: nextProps.workItems,
            openWorkItems: this.state.openWorkItems,
            selectedWorkItems: nextProps.selectWorkItems,
            hasNeededSettings: hasRequiredSettings({ repoSettings: nextProps.repoSettings, defaultSettings: nextProps.repoSettings} as any)
        }));
    }

    toastTheError(error:any) {
        switch (error?.status) {
            case 404:
                toastr.error(`Check your Organization, Project, and Team settings.  <br/><br/>
                Not Found: ${error.url}`, `Error: (HTTP ${error.status})`, {timeOut: 10000});
                break;
            case 401:
                toastr.error(`Check your Personal Access Token (Might be expired or just bad value).`, `Error: (HTTP ${error.status})`, {timeOut: 20000});
                break;
            case 403:
                toastr.error(`Make sure your Personal Access Token has permissions to read your work items.`, `Error: (HTTP ${error.status})`, {timeOut: 20000});
                break;
            case 203:
                toastr.error(`Check your Personal Access Token (Might be expired or just bad value).`, `Error: (HTTP ${error.status})`, {timeOut: 20000});
                break;
        }
    }

    componentDidMount(): void {
        if(this.props.settingsLoaded && this.state.hasNeededSettings) {
            this.getWorkItemsFromApi();
        }
        if(!this.props.rememberWorkItems) {
            this.props.dispatch(clearSelectedWorkItems());
        }
        document.addEventListener("keyup", this.onAppKeyUp, false);
    }

    componentWillUnmount(): void {
        document.removeEventListener("keyup", this.onAppKeyUp, false);
        if(! this.props.rememberWorkItems) {
            this.props.dispatch(clearSelectedWorkItems());
        }
    }

    onAppKeyUp = (event: any) => {
        if(event.key ==='Enter'){
          this.quitAppSendSelectedItems();
        }
    }

    quitAppSendSelectedItems(){
        const commitIds = `#${this.state.selectedWorkItems.join(',#')}`;
        const rSettings  = this.props.repoSettings;
        rSettings.selectedWorkItems = this.state.selectedWorkItems;

        this.props.saveSettings(rSettings);
        this.props.dispatch(saveRepoSettings(rSettings));
        this.props.appendCommitMessage(this.props.repoSettings.commitMessageFilePath as string, commitIds);
        ipc.send('quit-app', commitIds);
    }

    toggleWi(index: number) {
        const wiArr = this.state.openWorkItems;
        wiArr[index]= !wiArr[index];
        this.setState(prevState => ({
            openWorkItems: wiArr
        }));
    }

    toggleWorkItemSelected(event: any, workItemId: any ) {
        event?.stopPropagation();
        this.props.dispatch(toggleWorkItemSelected(workItemId));
    }

    workItemIsChecked = (id: any): boolean => {
        return this.state.selectedWorkItems.some( wi => wi === id);
    }

    renderSelectedTasks = (wi: WorkItem): React.ReactNode => {
        const selectedTasks = wi.tasks
            ?.filter( s => this.state.selectedWorkItems.some(swi => swi === s.id))
            ?.map(w => w.id);

        return (selectedTasks && selectedTasks?.length > 0 ) ?
            <span className="selected-tasks">
                <b>{selectedTasks.length > 1 ? 'Tasks' : 'Task'}</b>: {selectedTasks.map( (value, index) => {
                return index !== 0 ? `, ${value}`: value;
            })}</span>
            : "";
    }

    renderSelectedWorkItems = (): React.ReactNode => {
        const selectedItems  = this.state?.selectedWorkItems?.map(swi => this.props.workItems.find(wi => wi.id === swi) ?? {type: 'Task', id: swi});
        const groupedItems = groupBy('type')(selectedItems);

        return (groupedItems && Object.keys(groupedItems).length > 0)
            ? <div className="selected-work-items-wrapper">
                <div><b>Associating Commit To</b>:</div>
                <div className="selected-work-items-group">{Object.keys(groupedItems).map((key: any) => <span key={key.toLowerCase()}><span className="wi-type-lbl">{key}</span>: {
                    groupedItems[key].map((wi: any, index: number) => index === 0 ? wi.id : `, ${wi.id}`)}</span>)}</div>
              </div>
            : "";
    }
    renderWorkItemTypeIcon = (wi: WorkItem) => {
         switch (wi.type) {
             case "User Story":
                 return (<span className="icon-user-story">{userStory()}</span>);
             case "Bug":
                 return (<span className="icon-bug">{bug()}</span>);
             case "Support Request":
                 return (<span className="icon-support-request">{supportRequest()}</span>);
         }
    }

    filterWorkItems = (filterText: string) => {
        console.log(filterText);
        const filteredItems = this.props.workItems.filter(wi => this.searchForValue(wi, filterText));

        this.setState({
            workItems:filteredItems,
            searchText: filterText
        });
    }

    searchForValue = (obj: any, val: string): boolean => {
        return Object.keys(obj).some(k => {

            // if this is another object recurse
            if(obj[k] && typeof obj[k]==='object')
                return this.searchForValue(obj[k],val);

            // search in arrays
            if(obj[k] && Array.isArray(obj[k]))
                return obj[k]
                    .map((aObj: any) => this.searchForValue(aObj, val))
                    .some((hasVal: boolean) => hasVal);

            return obj[k]
                && (obj[k].toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
    }

    render(): React.ReactNode {
        if(!this.state.hasNeededSettings && this.props.settingsLoaded){
            return <Redirect to="/settings/default"/>
        }

        return(
            <div className="work-items">
                <h5>Current Sprint Work Items</h5>
                <p>Press escape key to close app without associating work items.  Press enter key or click submit button to link selected work items.</p>
                {this.state.isCallingApi ? <Loader message={"Fetching WorkItems"}></Loader> :""}

                {!this.state.isCallingApi ?
                    <div className="table-container">
                        {this.props.workItems && this.props.workItems.length > 0 ?
                            <input
                            onChange={ e => this.filterWorkItems(e.target.value) }
                            className="search-input"
                            type="search"
                            placeholder="Search Work Items and Tasks"
                            id="search-wi"/>
                            :""
                        }
                        <ul>
                            {this.state.workItems.map((wi: WorkItem, index: number) =>
                                <span
                                    key={wi.id}
                                    className={ this.state.openWorkItems[index] ? "accordion open" : "accordion"}>
                                    <li className="wi-list">
                                        <div className="wi-header">
                                            <span>
                                                <input
                                                    id={"work-item-"+ wi.id}
                                                    onChange={event => this.toggleWorkItemSelected(event, wi.id)}
                                                    checked={this.workItemIsChecked(wi.id)}
                                                    type="checkbox"/>
                                                <label
                                                    onClickCapture={event => this.toggleWorkItemSelected(event, wi.id)}
                                                    htmlFor={"task-"+ index} onClick={event => event.stopPropagation()}>{wi.name}</label>
                                            </span>
                                            <span
                                                onClick={() => this.toggleWi(index)}
                                                className="wi-type">{this.renderWorkItemTypeIcon(wi)} {wi.type}</span>
                                            <span onClick={() => this.toggleWi(index)}>{wi.status} </span>
                                            <span onClick={() => this.toggleWi(index)}>{this.renderSelectedTasks(wi)} </span>
                                            <span
                                                onClick={() => this.toggleWi(index)}>
                                                <svg className="chevron" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                                                  <title>chevron-down</title>
                                                  <polygon points="16 24.41 1.29 9.71 2.71 8.29 16 21.59 29.29 8.29 30.71 9.71 16 24.41"></polygon>
                                                </svg>
                                            </span>
                                        </div>
                                    </li>
                                    <div className="wi-details">
                                        <div className="detail-row">
                                            <div><b>Id:</b> {wi.id}</div>
                                            {wi.description ? <div className="description"><b>Description:</b> <span dangerouslySetInnerHTML={{__html: wi.description ?? ""}}></span></div>: ""}
                                            {wi.assignedTo?.displayName ? assignedToRender(wi.assignedTo):""}
                                        </div>

                                        <div className="detail-content">
                                            {
                                                wi?.tasks &&
                                                wi?.tasks?.length > 0 ?
                                                <span>
                                                    <h5>Tasks</h5>
                                                    <table
                                                        className="hover"
                                                        id={"tasks-table-"+index}>
                                                    <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th>Id</th>
                                                        <th>Name</th>
                                                        <th>Description</th>
                                                        <th>Status</th>
                                                        <th>Assigned To</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {wi.tasks?.map((task: Task, i: number) =>
                                                        <tr
                                                            key={"task-id-"+i}>
                                                            <td>
                                                                <input
                                                                    id={wi.id+"-"+i}
                                                                    onChange={event => this.toggleWorkItemSelected(null, task.id)}
                                                                    checked={this.workItemIsChecked(task.id)}
                                                                    type="checkbox"/>
                                                            </td>
                                                            <td onClick={ event => this.toggleWorkItemSelected(event, task.id)}>{task.id}</td>
                                                            <td onClick={ event => this.toggleWorkItemSelected(event, task.id)}>{task.name}</td>
                                                            <td onClick={ event => this.toggleWorkItemSelected(event, task.id)} dangerouslySetInnerHTML={{__html: task.description ??""}}></td>
                                                            <td onClick={ event => this.toggleWorkItemSelected(event, task.id)}>{task.status}</td>
                                                            <td onClick={ event => this.toggleWorkItemSelected(event, task.id)}>{task.assignedTo?.displayName}</td>
                                                        </tr>)
                                                    }
                                                    </tbody>
                                                </table>
                                                </span>
                                                 : <h5>No Tasks</h5>
                                            }
                                        </div>
                                    </div>
                                </span>
                                )}
                        </ul>
                    </div>
                    : ""
                }
                <div className="footer">
                    <div>
                        <button
                            onClick={() => this.quitAppSendSelectedItems()}
                            className="button primary"
                            type="button">Submit</button>
                    </div>
                    {this.renderSelectedWorkItems()}
                </div>
            </div>
        );
    }
}

const assignedToRender = (assignedTo: AssignedTo): React.ReactNode => (
    <span className="assigned-to">
        <div><b>Assigned To:</b><br/>{assignedTo?.displayName}</div>
        <img alt={`${assignedTo.displayName} portrait`} src={assignedTo?.pictureUrl}/>
    </span>
);

const select = (appState: AdoState) => {
    return {
        adoSecurity: getADOSecurityContext(appState),
        settingsLoaded: appState.bothSettingsLoaded,
        workItems: appState.workItems,
        selectWorkItems: appState.selectedWorkItemIds,
        rememberWorkItems: rememberWorkItems(appState),
        repoSettings: appState.repoSettings,
        defaultSettings: appState.defaultSettings,
        hasRequiredSettings: hasRequiredSettings(appState)
    };
};

export default connect(select)(WorkItems);
