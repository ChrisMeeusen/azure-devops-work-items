import React from "react";
import "./Loader.scss";

const Loader = (props: any) => {

    return (
        <div id="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <h6>{props.message}</h6>
        </div>
    );
}

export default Loader;
