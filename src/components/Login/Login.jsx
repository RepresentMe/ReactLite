import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import FacebookLogin from 'react-facebook-login';

var Login = inject("UserStore")(observer(({ UserStore, match, push }) => {

  let redirect = match.params.redirect;

  if(UserStore.userData.has("id")) { // If user is logged in, redirect
    if(redirect) {
      push("/" + decodeURIComponent(redirect));
    }else {
      push("/");
    }
  }

  return (
    <div style={{ display: 'table', width: '100%', height: '100%' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
        <h1>Please sign into your Represent account</h1>
        <FacebookLogin
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
            display: 'block',
            width: '200px'
          }}
          textButton="Continue with Facebook"
          />

        <FlatButton
          label="I don't have an account"
          style={{
            display: 'block',
            margin: '10px auto',
          }}
          onClick={() => push("/register/" + redirect)}
        />

        <p style={{textAlign: 'center'}}>I have read and agree to the <a href="http://help.represent.me/policies/terms-of-use/">terms and conditions</a> and <a href="http://help.represent.me/policies/privacy-policy/">privacy policy</a></p>
      </div>



    </div>
  )
}))

export default Login;
