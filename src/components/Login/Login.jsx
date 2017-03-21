import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import FacebookLogin from 'react-facebook-login';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { grey100 } from 'material-ui/styles/colors';
import smallLogo from './represent_white_outline.svg';
import './Login.css';

var Login = inject("UserStore")(observer(({ UserStore, match, history }) => {

  let redirect = match.params.redirect;

  if(UserStore.userData.has("id")) { // If user is logged in, redirect
    if(redirect) {
      history.push("/" + decodeURIComponent(redirect));
    }else {
      history.push("/");
    }
  }

  return (
    <div style={{ display: 'table', width: '100%', height: '100%' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', padding: '10px 20px' }}>
        <Paper zDepth={1} style={{padding: '10px 20px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto'}}>
          <img src={smallLogo} style={{margin: '0 35%', width: '30%'}} />
          <p style={{fontWeight: 'bold'}}>Please Login to Continue</p>
          <TextField hintText="Username / email" style={{width: '100%'}}/><br />
          <TextField hintText="Password" type="password" style={{width: '100%'}}/><br />
          <FlatButton label="login" style={{width: '100%', marginBottom: '5px'}} backgroundColor={grey100} secondary />

          <FacebookLogin
            cssClass="custom-facebook-login-button"
            appId={String(window.authSettings.facebookId)}
            autoLoad={false}
            fields="name,email,picture"
            callback={(result) => {
              if(result.accessToken) {
                UserStore.authYeti('facebook', result.accessToken);
              }else {

              }
            }}
            style={{
              display: 'inline-block',
              width: '100%',
            }}
            textButton="Continue with Facebook"
            />
          <p style={{textAlign: 'center', fontSize: '12px'}}>By using the service, you agree to the <a href="https://represent.me/legal/terms/">terms and conditions</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a><br/><br/><a onClick={() => history.push("/register/" + redirect)}>{"Don't have an account?"}</a></p>
        </Paper>
        {redirect && <Paper onClick={() => history.push("/" + decodeURIComponent(redirect))} zDepth={1} style={{padding: '10px 20px', maxWidth: '320px', marginLeft: 'auto', marginRight: 'auto', marginTop: '10px'}}>
          <a>&larr; {"Back to collection"}</a>
        </Paper>}
      </div>



    </div>
  )
}))

export default Login;
