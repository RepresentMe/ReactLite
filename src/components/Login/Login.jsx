import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login';

var Login = inject("UserStore")(observer(({ UserStore, match }) => {
  return (
    <div style={{ display: 'table', width: '100%', height: '100%' }}>
      <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
        <FacebookLogin
          appId="1665890767015993"
          autoLoad={true}
          fields="name,email,picture"
          callback={(result) => {
            if(result.accessToken) {
              UserStore.authYeti('facebook', result.accessToken);
            }else {

            }
          }} />
          <p style={{margin: "20px", textAlign: 'center'}}>I have read and agree to the <a href="http://help.represent.me/policies/terms-of-use/">terms and conditions</a> and <a href="http://help.represent.me/policies/privacy-policy/">privacy policy</a></p>
      </div>
    </div>
  )
}))

export default Login;
