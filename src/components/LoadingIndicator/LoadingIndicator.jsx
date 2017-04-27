import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";
import CircularProgress from 'material-ui/CircularProgress';
import { cyan600 } from 'material-ui/styles/colors';

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
        <div style={containerStyle}><CircularProgress size={80} thickness={5} color={cyan600} /></div>
    )
}

export default LoadingIndicator;
