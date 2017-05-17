import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import FacebookLogin from 'react-facebook-login';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import {indigo500 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';

import DynamicConfigService from '../../services/DynamicConfigService';

import './Login.css';

const styles = {
  imgStyle: {
    height: '30px',
    verticalAlign: 'middle',
    marginRight: '10px',
    marginTop: '-4px'
  },
  floatingLabelText: {
    color: '#1B8AAE',
  },
  errorStyle: {
    color: '#cc0000'
  },
  facebookLoginStyle: {
    display: 'block',
    width: '100%',
    marginTop: '30px',
    color: 'white',
    backgroundColor: indigo500
  }
}

@inject("UserStore") @observer export default class LoginComponent extends Component {
  constructor(props){
    super(props)
  this.state = {
      email: "",
      password: "",
      problems: []
    }
  this.problemList = {
      emailProblem: "Please check you've entered a valid email address",
      passwordProblem: 'Password should be at least 8 characters long',
    }
  }

  componentWillMount() {
    if(this.props.match.params.email) {
      this.setState({email: decodeURIComponent(this.props.match.params.email)});
    }

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      // this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }
  componentWillUpdate() {
    if(this.props.UserStore.userData.has("id")) { // If user is logged in, redirect
      //ToDo undestand what and how dynamicConfig??
      //temporary fix -> redirect to main
      console.log(this.props)
      if(this.props.match.params.dynamicConfig) {
        this.props.history.push(this.dynamicConfig.getNextRedirect());
       }else {
        this.props.history.push("/");
      }
    }
  }
  handleInput = (stateProp, value) => {
    this.setState({[stateProp]: value})
    if (stateProp === 'email') {
      //const problems = this.state.problems.filter(p => p !== this.problemList.emailProblem);
      this.setState({problems: []});
    }
    else if (stateProp === 'password'){
      //const problems = this.state.problems.filter(p => p !== this.problemList.passwordProblem);
      this.setState({problems: []});
    }
  }
  facebookCallback = (result) => {
    if(result.accessToken) {
      this.props.UserStore.facebookLogin(result.accessToken);
      this.props.history.push(this.dynamicConfig.getNextRedirect())
    }
  }
  attemptLogin = () => {
    this.props.UserStore.authLogin(this.state.email, this.state.password).catch((error) => {
      if(error.response.data.non_field_errors) {
        this.setState({problems: ["Username / password combination not found! Please check your details and try again"]});
      }else {
        this.setState({problems: JSON.stringify(error.response.data).replace(/:/g,": ").replace(/[&\/\\#+()$~%.'"*?<>{}\[\]]/g, "").split(",")});
      }
      this.props.history.push(this.dynamicConfig.getNextRedirect())
    })
  }
  render() {
  return (
    <div style={{width: '100%', height: '100%'}}>
      <Paper zDepth={0} className='containerStyle'>

        <div style={{textAlign: 'center'}}>
        <img src="/static/media/represent_white_outline.dbff67a6.svg" style={{ height: 60, margin: '10px auto'}} />

        <h2 style={{margin: '10px 0'}}>
          Welcome back! 
        </h2>
        </div>

        <TextField
          floatingLabelText="Email address"
          floatingLabelFocusStyle={styles.floatingLabelText}
          style={{width: '100%'}}
          value={this.state.email}
          onChange={(e, newValue) => this.handleInput('email', newValue)}
          // errorText={this.state.problems ? this.state.problems[0] : ''}
          // errorStyle={styles.errorStyle}
          /><br />
        <TextField
          floatingLabelText="Password"
          floatingLabelFocusStyle={styles.floatingLabelText}
          type="password"
          style={{width: '100%'}}
          value={this.state.password}
          // errorText={this.state.problems ? this.state.problems[1] : ''}
          // errorStyle={styles.errorStyle}
          onChange={(e, newValue) => this.handleInput('password', newValue)}
          />

        <RaisedButton
          label={<span className='fbMockButton' style={{color: 'white'}}>login</span>}
          primary={true}
          onTouchTap={this.attemptLogin}
          buttonStyle={{backgroundColor: '#1B8AAE'}}
          style={{width: '100%', marginTop: 20}}
        />

         

        <FacebookLogin
          appId={String(window.authSettings.facebookId)}
          autoLoad={false}
          fields="name,email,picture"
          callback={this.facebookCallback}
          style={styles.facebookLoginStyle}
          textButton="login with Facebook"
          buttonStyle={{cursor: 'pointer', width: '100%', paddingBottom: 7, paddingTop: 5, textAlign: 'middle', margin: '10px auto'}}
          disableMobileRedirect={true}
          icon={<FacebookBox color='white' style={{verticalAlign: 'middle', marginRight: 10, width: 18, height: 18 }}/>}

          />

        <p style={{textAlign: 'center', fontSize: '12px', cursor: 'pointer'}}>
          <a href='https://app.represent.me/access/forgot-password/'>
            Forgotten your password?
          </a>
        </p>

      </Paper>

      <Dialog
        title="Could not complete login"
        open={this.state.problems.length ? true : false}
        onRequestClose={() => this.setState({problems: []})}
        actions={
          <FlatButton
            label="Close"
            primary={true}
            onTouchTap={() => this.setState({problems: []})}
          />
        }
      >
        {this.state.problems && this.state.problems.map((problem, index) => {
          return <p key={index} style={{textAlign: 'left'}}>{problem}</p>
        })}
      </Dialog>

    </div>

  )
}}
