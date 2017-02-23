import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Add from 'material-ui/svg-icons/content/add';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { white, cyan600 } from 'material-ui/styles/colors';
import CollectionsList from '../CollectionsList';
import CollectionIntro from '../CollectionIntro';
import QuestionFlow from '../QuestionFlow';
import { observer } from "mobx-react";

import './Shell.css';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: white,
    alternateTextColor: cyan600,
  }
});

export default observer(class Shell extends Component {

  render() {

    return(
      <Router>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={{height: '100vh'}}>

                <AppBar
                  title="Represent"
                  iconElementLeft={<IconButton><ArrowBack /></IconButton>}
                  iconElementRight={<IconButton><Add /></IconButton>}
                />

                <div style={{height: "calc(100% - 64px)", overflow: 'scroll'}}>
                  <Route exact path="/" component={CollectionsList}/>
                  <Route exact path="/collection/:collectionId" component={CollectionIntro}/>
                  <Route exact path="/collection/:collectionId/flow/:orderNumber" component={QuestionFlow}/>
                </div>
              </div>
          </MuiThemeProvider>
      </Router>
    )
  }

});
