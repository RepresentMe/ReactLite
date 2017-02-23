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
      </div>
    </div>
  )
}))

export default Login;
