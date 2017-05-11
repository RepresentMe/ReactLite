import React from 'react';

import { cyan600 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
// import TextField from 'material-ui/TextField';
// import Paper from 'material-ui/Paper';
//import Dialog from 'material-ui/Dialog';
//import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

//import DynamicConfigService from '../../services/DynamicConfigService';

import './RegisterNewUser.css';

const styles = {
  containerStyle: {
    padding: '10px 20px',
    maxWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  imgStyle: {
    height: '30px',
    verticalAlign: 'middle',
    marginRight: '10px',
    marginTop: '-4px'
  },
  txtStyle: {
    fontWeight: 'bold'
  }
}

const Page3 = (props) => {

  return (
    <div style={{width: '100%', height: '100%'}}>
      <p style={styles.txtStyle}>
        Sign up was successful, welcome to Represent!
      </p>
      <RaisedButton
        label="Explore!"
        primary={true}
        style={{flex: 1, width: '100%'}}
        onTouchTap={props.attemptLogin}
      />
    </div>
  )
}

export default Page3;
