import React from 'react';
import {connect} from "react-redux";
import './Work-items.scss';
import {AdoState} from "../../redux/reducer";
import {ADOSecurityContext} from "../../models/ado-api";
import {getADOSecurityContext, hasRequiredSettings} from "../../redux/selectors";
import {WorkItem, WorkItemComponentState} from "../../models/work-item";
import Loader from "../loading/Loader";
import {getWorkItems, getWorkItemsError, getWorkItemsSuccess} from "../../redux/actions";
import toastr from "toastr";


class WorkItems extends React.Component<
    {
        adoSecurity: ADOSecurityContext,
        settingsLoaded: boolean,
        getWorkItems(adoSecurity: ADOSecurityContext): Promise<WorkItem[]>,
        dispatch: any,
        workItems: WorkItem[]
    }, WorkItemComponentState>{

    constructor(props: any) {
        super(props);
        this.state = {
            hasNeededSettings: false,
            workItems: [],
            isCallingApi: false,
            openWorkItems:[],
        } as WorkItemComponentState;

        this.toggleWi = this.toggleWi.bind(this);
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
            openWorkItems: nextProps.workItems.map((wi: WorkItem) => false)
        }));
    }

    toastTheError(error:any) {
        switch (error?.status) {
            case 404:
                toastr.error(`Check your Organization, Project, and Team settings.  <br/><br/>
                Not Found: ${error.url}`,`Error ${error.status}`, {timeOut: 10000});
                break;
            case 401:
                toastr.error(`Check your Personal Access Token (Might be expired or just bad value).`,`Error ${error.status}`, {timeOut: 10000});
                break;
            case 403:
                toastr.error(`Make sure your Personal Access Token has permissions to rear your work items.`,`Error ${error.status}`, {timeOut: 10000});
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

    render(): React.ReactNode {
        return(
            <div className="work-items">
                <h5>Work Items</h5>
                {this.state.isCallingApi ? <Loader message={"Fetching WorkItems"}></Loader> :""}

                {!this.state.isCallingApi ?
                    <div className="table-container">
                        <ul>
                            {this.state.workItems.map((wi: WorkItem, index: number) =>
                                <span
                                    key={wi.id}
                                    className={ this.state.openWorkItems[index] ? "accordion open" : "accordion"}>
                                    <li
                                        onClick={() => this.toggleWi(index)}>
                                        <div className="wi-header">
                                            <span>{wi.name}</span>
                                            <span>{wi.type}</span>
                                            <span>{wi.status}</span>
                                        </div>

                                    </li>
                                    <div className="wi-details">
                                        <div className="detail-row">
                                            <div><span className="lbl">Id:</span> {wi.id}</div>
                                            {wi.description ? <div className="description"><span className="lbl">Description:</span> <span dangerouslySetInnerHTML={{__html: wi.description ?? ""}}></span></div>: ""}
                                            {wi.assignedTo?.displayName ? <div><span className="lbl">Assigned To:</span><img src={wi?.assignedTo?.pictureUrl}/> {wi.assignedTo?.displayName}</div>: ""}
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

const select = (appState: AdoState) => {
    return {
        adoSecurity: getADOSecurityContext(appState),
        settingsLoaded: appState.bothSettingsLoaded,
        workItems: appState.workItems
    };
};

export default connect(select)(WorkItems);
