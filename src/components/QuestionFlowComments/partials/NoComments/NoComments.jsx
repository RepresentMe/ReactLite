import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Paper from 'material-ui/Paper';

const style = {
  minHeight: '300px',
  padding: '20px 30px',
  textAlign: 'center' 
}

class NoComments extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Paper zDepth={0} style={style}>
        <h1> Be the first to leave a comment</h1>
      </Paper>
    );
  }
}


export default NoComments;