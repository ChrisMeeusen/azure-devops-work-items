import React from 'react';
import {connect} from "react-redux";
import './Work-items.scss';
import {AdoState} from "../../redux/reducer";
import {ADOSecurityContext} from "../../models/ado-api";
import {getADOSecurityContext, hasRequiredSettings} from "../../redux/selectors";
import {AssignedTo, Task, WorkItem, WorkItemComponentState} from "../../models/work-item";
import Loader from "../loading/Loader";
import {getWorkItems, getWorkItemsError, getWorkItemsSuccess, selectWorkItem} from "../../redux/actions";
import toastr from "toastr";
import {bug, supportRequest, userStory} from "../../models/icons";
import {type} from "os";


class WorkItems extends React.Component<
    {
        adoSecurity: ADOSecurityContext,
        settingsLoaded: boolean,
        getWorkItems(adoSecurity: ADOSecurityContext): Promise<WorkItem[]>,
        dispatch: any,
        workItems: WorkItem[],
        selectWorkItems: any[]
    }, WorkItemComponentState>{

    constructor(props: any) {
        super(props);
        this.state = {
            hasNeededSettings: false,
            workItems: [],
            isCallingApi: false,
            openWorkItems:[],
            selectedWorkItems:[]
        } as WorkItemComponentState;

        this.toggleWi = this.toggleWi.bind(this);
        this.toggleWorkItemSelected = this.toggleWorkItemSelected.bind(this);
        this.workItemIsChecked = this.workItemIsChecked.bind(this);
        this.renderSelectedTasks = this.renderSelectedTasks.bind(this);
        this.renderWorkItemTypeIcon = this.renderWorkItemTypeIcon.bind(this);
        this.filterWorkItems = this.filterWorkItems.bind(this);
        this.renderSelectedWorkItems = this.renderSelectedWorkItems.bind(this);
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if(prevProps.settingsLoaded !== this.props.settingsLoaded && prevProps.settingsLoaded === false) {
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
        this.setState(prevState => ({
            workItems: nextProps.workItems,
            openWorkItems: this.state.openWorkItems,
            selectedWorkItems: nextProps.selectWorkItems
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
        if(this.props.settingsLoaded) {
            this.getWorkItemsFromApi();
        }
    }

    toggleWi(index: number) {
        const wiArr = this.state.openWorkItems;
        wiArr[index]= !wiArr[index];
        this.setState(prevState => ({
            openWorkItems: wiArr
        }));
    }

    toggleWorkItemSelected(event: any, workItemId: any ) {
        event?.preventDefault();
        event?.stopPropagation();
        this.props.dispatch(selectWorkItem(workItemId));
    }

    workItemIsChecked = (id: any): boolean => {
        return this.state.selectedWorkItems.some( wi => wi === id);
    }

    renderSelectedTasks = (wi: WorkItem): React.ReactNode => {
        const selectedTasks = wi.tasks
            ?.filter( s => this.state.selectedWorkItems.some(swi => swi === s.id))
            ?.map(w => w.id);

        return (selectedTasks && selectedTasks?.length > 0 ) ?
            <span>
            <span className="selected-tasks">
                <b>{selectedTasks.length > 1 ? 'Tasks' : 'Task'}</b>: {selectedTasks.map( (value, index) => {
                return index !== 0 ? `, ${value}`: value;
            })}</span>
            </span>
            : <span></span>;
    }

    renderSelectedWorkItems = (): React.ReactNode => {
        return (this.state.selectedWorkItems && this.state.selectedWorkItems.length > 0)
            ? <span className="selected-tasks lg"><b>Selected Work Items</b>: {this.state.selectedWorkItems.map( (w, index) => index !== 0 ? `, ${w}`: w )}
              </span>
            : <span></span>;
    }
    renderWorkItemTypeIcon = (wi: WorkItem) => {
         switch (wi.type) {
             case "User Story":
                 return (<span className="icon-user-story">{userStory()}</span>);
             break;
             case "Bug":
                 return (<span className="icon-bug">{bug()}</span>);
             break;
             case "Support Request":
                 return (<span className="icon-support-request">{supportRequest()}</span>);
             break;
         }
    }

    filterWorkItems = (filterText: string) => {
        console.log(filterText);
        const filteredItems = this.props.workItems.filter(wi => this.searchForValue(wi, filterText));

        this.setState({
            workItems:filteredItems
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
        return(
            <div className="work-items">
                <h5 className="mb">Current Sprint Work Items</h5>
                {this.state.isCallingApi ? <Loader message={"Fetching WorkItems"}></Loader> :""}

                {!this.state.isCallingApi ?
                    <div className="table-container">
                        <input
                            onChange={ e => this.filterWorkItems(e.target.value) }
                            className="search-input"
                            type="search"
                            placeholder="Search Work Items and Tasks"
                            id="search-wi"/>
                        {this.renderSelectedWorkItems()}
                        <ul>
                            {this.state.workItems.map((wi: WorkItem, index: number) =>
                                <span
                                    key={wi.id}
                                    className={ this.state.openWorkItems[index] ? "accordion open" : "accordion"}>
                                    <li className="wi-list"
                                        onClick={() => this.toggleWi(index)}>
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
                                            <span className="wi-type">{this.renderWorkItemTypeIcon(wi)} {wi.type}</span>
                                            <span>{wi.status}</span>
                                            {this.renderSelectedTasks(wi)}
                                            <span>
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
                    :""
                }
            </div>
        );
    }
}

const assignedToRender = (assignedTo: AssignedTo): React.ReactNode => (
    <span className="assigned-to">
        <div><b>Assigned To:</b><br/>{assignedTo?.displayName}</div>
        <img src={assignedTo?.pictureUrl}/>
    </span>
);




const select = (appState: AdoState) => {
    return {
        adoSecurity: getADOSecurityContext(appState),
        settingsLoaded: appState.bothSettingsLoaded,
        workItems: appState.workItems,
        selectWorkItems: appState.selectedWorkItemIds
    };
};

export default connect(select)(WorkItems);
