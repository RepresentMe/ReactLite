import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";

let containerStyle = {
    'width': '100%',
    'height': '100%',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'backgroundColor': '#eeeeee'
}

const LoadingIndicator = (props) => {
    let text = props.text || "Loading...";
    return (
        <div style={containerStyle}>{text}</div>
    )
}

export default LoadingIndicator;