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
    }, WorkItemComponentState>{

    constructor(props: any) {
        super(props);
        this.state = {
            hasNeededSettings: false,
            workItems: [],
            isCallingApi: false
        } as WorkItemComponentState;
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

    render(): React.ReactNode {
        return(
            <div className="work-items">
                <h5>Work Items</h5>
                {this.state.isCallingApi ? <Loader message={"Fetching WorkItems"}></Loader> :""}
            </div>
        );
    }
}

const select = (appState: AdoState) => {
    return {
        adoSecurity: getADOSecurityContext(appState),
        settingsLoaded: appState.bothSettingsLoaded
    };
};

export default connect(select)(WorkItems);
