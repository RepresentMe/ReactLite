import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import Add from 'material-ui/svg-icons/content/add';
import Face from 'material-ui/svg-icons/action/face';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { white, cyan600 } from 'material-ui/styles/colors';
import CollectionsList from '../CollectionsList';
import CollectionIntro from '../CollectionIntro';
import CollectionEnd from '../CollectionEnd';
import EditCollection from '../EditCollection';
import QuestionFlow from '../QuestionFlow';
import CreateCollection from '../CreateCollection';
import Login from '../Login';
import { inject, observer } from "mobx-react";
import createHistory from 'history/createBrowserHistory'
import Test from '../Test'

import './Shell.css';

import {
  Router,
  Route,
  Link
} from 'react-router-dom'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: white,
    alternateTextColor: cyan600,
  }
});

const history = createHistory();

@inject("UserStore") @observer export default class Shell extends Component {

  render() {

    history.listen((location, action) => { // Storing location in UserStore forces a rerender of the Shell each navigation
      this.props.UserStore.sessionData.set("userLocation", location);
    });

    return(
      <Router history={history}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={{height: '100vh'}}>

                <AppBar
                  title="Represent"
                  iconElementLeft={this.props.UserStore.sessionData.get("userLocation").pathname !== "/" ? <IconButton onClick={() => { history.goBack() }}><ArrowBack color={cyan600} /></IconButton> : null}
                  iconElementRight={<Avatar icon={<Face />} backgroundColor={cyan600} onClick={() => {
                    if(this.props.UserStore.userData.has("id")) { // Is user logged in?
                      this.props.UserStore.toggleUserDialogue();
                    }else {
                      if(history.location.pathname !== "/login"){
                        history.push("/login");
                      }
                    }
                  }}/>}
                />

                <Dialog
                  title="My Account"
                  actions={
                    <div>
                    <FlatButton
                      label="Create a Collection"
                      secondary={false}
                      onTouchTap={() => {
                        this.props.UserStore.toggleUserDialogue();
                        history.push("/collection/create");
                      }}
                    />
                    <FlatButton
                      label="Logout"
                      secondary={true}
                      onTouchTap={() => {
                        this.props.UserStore.logout();
                      }}
                    />
                    <FlatButton
                      label="Close"
                      secondary={true}
                      onTouchTap={() => {
                        this.props.UserStore.toggleUserDialogue();
                      }}
                    />
                    </div>
                  }
                  modal={false}
                  open={this.props.UserStore.sessionData.get("showUserDialogue")}
                  onRequestClose={() => {
                    this.props.UserStore.toggleUserDialogue();
                  }}
                >
                  <TextField disabled={true} id="text-field-disabled" defaultValue={this.props.UserStore.userData.get("first_name")} fullWidth={true}/>
                  <TextField disabled={true} id="text-field-disabled" defaultValue={this.props.UserStore.userData.get("last_name")} fullWidth={true}/>
                </Dialog>

                <div style={{height: "calc(100% - 64px)", overflow: 'scroll'}}>
                  <Route exact path="/" component={CollectionsList}/>
                  <Route exact path="/login" component={Login}/>
                  <Route exact path="/collection/create" component={CreateCollection}/>
                  <Route exact path="/collection/:collectionId" component={CollectionIntro}/>
                  <Route exact path="/collection/:collectionId/edit" component={EditCollection}/>
                  <Route exact path="/collection/:collectionId/flow/:orderNumber" component={QuestionFlow}/>
                  <Route exact path="/collection/:collectionId/end" component={CollectionEnd}/>
                  <Route exact path="/test" component={Test}/>
                </div>
              </div>
          </MuiThemeProvider>
      </Router>
    )
  }

};
