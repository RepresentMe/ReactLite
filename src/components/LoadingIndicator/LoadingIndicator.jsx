import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx"; 

let containerStyle = {
    'width': '100vw',
    'height': '100vh',
    'display': 'flex',
    'justifyContent': 'center',
    'alignItems': 'center',
    'backgroundColor': '#fff',
    'color' : '#1B8AAE',
}

const LoadingIndicator = (props) => {
    let text = props.text || "Loading...";
    return (
        <div style={containerStyle}> 
            <img src="https://app.represent.me/assets/img/logos/animated/long-100.gif" />
        </div>
        
    )
}

export default LoadingIndicator;
