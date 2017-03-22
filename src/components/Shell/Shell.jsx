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
import { white, cyan600, black, grey700 } from 'material-ui/styles/colors';
import CollectionsList from '../CollectionsList';
import CollectionIntro from '../CollectionIntro';
import CollectionEnd from '../CollectionEnd';
import EditCollection from '../EditCollection';
import QuestionFlow from '../QuestionFlow';
import CreateCollection from '../CreateCollection';
import Login from '../Login';
import Register from '../Register';
import JoinGroup from '../JoinGroup';
import { inject, observer } from "mobx-react";
import createHistory from 'history/createBrowserHistory'
import Test from '../Test';
import NetworkProgress from '../NetworkProgress';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import smallLogo from './represent_white_outline.svg';

import './Shell.css';

import {
  Router,
  Route,
} from 'react-router-dom'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: white,
    alternateTextColor: cyan600,
  },
  slider: {
    selectionColor: cyan600,
    rippleColor: cyan600,
  },
  raisedButton: {
    textColor: white,
  },
  flatButton: {
    primaryTextColor: cyan600,
    secondaryTextColor: grey700,
  },
  datePicker: {
    textColor: white,
    color: cyan600,
    selectTextColor: white
  },
  checkbox: {
    checkedColor: cyan600
  }
});

const history = createHistory();

function onProfileClick(){
  if(this.props.UserStore.userData.has("id")) { // Is user logged in?
    this.props.UserStore.toggleUserDialogue();
  }else {
    if(history.location.pathname !== "/login"){
      history.push("/login/" + encodeURIComponent(history.location.pathname.substring(1)));
    }
  }
}

@inject("UserStore") @observer export default class Shell extends Component {

  render() {

    let split_pathname = history.location.pathname.split("/");

    // DISABLED HISTORY UPDATE TO STORE AS CAUSES OVERFLOW OF RENDERS
    // history.listen((location, action) => { // Storing location in UserStore forces a rerender of the Shell each navigation
    //   this.props.UserStore.userLocation.replace(location);
    // });
    //iconElementLeft={this.props.UserStore.userLocation.get("pathname") !== "/" ? <IconButton onClick={() => { history.goBack() }}><ArrowBack color={cyan600} /></IconButton> : null}

    let mainContentStyle = {
      height: "calc(100% - 28px)",
      overflow: 'scroll',
      position: "relative"
    }

    if(split_pathname[1] === 'joingroup') {
      mainContentStyle.height = "100%";
    }

    return(
      <Router history={history}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <div style={{height: '100vh'}}>

                {split_pathname[1] !== 'joingroup' &&
                  <div>
                    <AppBar
                      title="Represent"
                      iconElementLeft={<img src={smallLogo} style={{height: '20px'}} onClick={() => window.open("https://represent.me",'_blank')}/>}
                      iconElementRight={
                        <span>
                          <div onClick={() => onProfileClick.call(this)} style={{color: cyan600, fontSize: '14px', lineHeight: '16px', marginRight: '10px', marginTop: '4px', float: 'left'}}>{this.props.UserStore.userData.has("id") && this.props.UserStore.userData.get("first_name") + ' ' + this.props.UserStore.userData.get("last_name")}</div>
                          <Avatar style={{height: '16px', width: '16px', margin: '3px 0px'}} icon={!this.props.UserStore.userData.has("id") ? <Face /> : null} src={this.props.UserStore.userData.has("photo") ? this.props.UserStore.userData.get("photo").replace("localhost:8000", "represent.me") : null} backgroundColor={cyan600} onClick={() => onProfileClick.call(this)}/>
                      </span>}
                      style={{
                        height: '24px',
                        padding: 0,
                      }}
                      iconStyleLeft={{
                        margin: '2px 4px'
                      }}
                      iconStyleRight={{
                        marginRight: '8px',
                        marginTop: '0',
                      }}
                      titleStyle={{
                        margin: 0,
                        lineHeight: '24px',
                        fontSize: '16px',
                      }}
                      />

                    <NetworkProgress />
                  </div>
                }

                <Dialog
                  title="My Account"
                  actions={
                    <div>
                    {/*}<FlatButton
                      label="Create a Collection"
                      secondary={false}
                      onTouchTap={() => {
                        this.props.UserStore.toggleUserDialogue();
                        history.push("/collection/create");
                      }}
                    />*/}
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
                  <TextField value={this.props.UserStore.userData.get("first_name")} fullWidth={true} id="firstname"/>
                  <TextField value={this.props.UserStore.userData.get("last_name")} fullWidth={true} id="lastname"/>
                </Dialog>

                <div style={mainContentStyle}>
                  <ReactCSSTransitionGroup
                    transitionName="QuestionFlowTransition"
                    transitionEnterTimeout={1000}
                    transitionLeaveTimeout={1000}>

                    <Route exact path="/" component={CollectionsList}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/login/:redirect" component={Login}/>
                    <Route exact path="/register" component={Register}/>
                    <Route exact path="/register/:redirect" component={Register}/>
                    <Route exact path="/joingroup/:groupId" component={JoinGroup}/>
                    <Route exact path="/collection/create" component={CreateCollection}/>
                    <Route exact path="/collection/:collectionId" component={CollectionIntro}/>
                    <Route exact path="/collection/:collectionId/edit" component={EditCollection}/>
                    <Route exact path="/collection/:collectionId/flow/:orderNumber" component={QuestionFlow}/>
                    <Route exact path="/collection/:collectionId/end" component={CollectionEnd}/>
                    <Route exact path="/test" component={Test}/>
                  </ReactCSSTransitionGroup>
                </div>
              </div>
          </MuiThemeProvider>
      </Router>
    )
  }

};
