import React, { Component } from 'react'
import RaisedButton from 'material-ui/RaisedButton';

const ErrorReload = (props) => (
  <div style={{ display: 'table', width: '100%', height: '100%' }}>
    <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%' }}>
      <h3>Oops...</h3>
      <p>{props.message || "Something went wrong!"}</p>
      <RaisedButton primary label="Try again" onClick={() => location.reload()} />
    </div>
  </div>
)

export default ErrorReload
