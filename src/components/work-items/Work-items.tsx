import React from 'react';
import {connect} from "react-redux";
import './Work-items.scss';
import {AdoState} from "../../redux/reducer";
import {ADOSecurityContext} from "../../models/ado-api";
import {Redirect} from "react-router-dom";
import {getADOSecurityContext, hasRequiredSettings} from "../../redux/selectors";
import {WorkItem} from "../../models/work-item";


class WorkItems extends React.Component<
    {
        adoSecurity: ADOSecurityContext
        getWorkItems(adoSecurity: ADOSecurityContext): Promise<WorkItem[]>
    }, any>{

    constructor(props: any) {
        super(props);
    }

    componentWillReceiveProps(nextProps: any , nextContext: any): void {

    }

    render(): React.ReactNode {
        setTimeout(() => {
            if(!hasRequiredSettings(this.props.adoSecurity)) {
                return <Redirect to="/settings/default" />
            }
        },100);

        if(hasRequiredSettings(this.props.adoSecurity)){
            this.props.getWorkItems(this.props.adoSecurity);
        }



        return (
            <div className="work-items">
                <h5>Work Items</h5>
            </div>
        );
    }
}

const select = (appState: AdoState) => {
    return {
        adoSecurity: getADOSecurityContext(appState)
    };
};

export default connect(select)(WorkItems);
