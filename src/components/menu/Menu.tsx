import React from 'react';
import {NavLink, useLocation} from 'react-router-dom';


const Menu = () => {

    const location = useLocation();

    return (
        <div className="button-group no-gaps">
            <NavLink
                to ="/work-items"
                className={`button ${location.pathname === '/work-items' ? '':'hollow'}`}
            >Work Items</NavLink>
            <NavLink
                to="/settings/repo"
                className={`button ${location.pathname === '/settings/repo' ? '':'hollow'}`}
            >Repo Settings</NavLink>
            <NavLink
                to="/settings/default"
                className={`button ${location.pathname === '/settings/default' ? '':'hollow'}`}
            >Default Settings</NavLink>
        </div>
    );
}

export default Menu;
