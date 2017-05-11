import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import FacebookLogin from 'react-facebook-login';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { grey100, cyan600, orange500 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';


import './RegisterNewUser.css';

const styles = {
  imgStyle: {
    height: '30px',
    verticalAlign: 'middle',
    marginRight: '10px',
    marginTop: '-4px'
  },
  floatingLabelText: {
    color: cyan600,
  },
  facebookLoginStyle: {
    display: 'inline-block',
    width: '100%'
  },
  errorStyle: {
    color: orange500
  }
}

const Page2 = (props) => {

  return (
    <div style={{width: '100%', height: '100%'}}>
      <Paper zDepth={0} className='containerStyle'>
        <p style={{margin: '10px 0'}}>
          In a democracy it's important to know that
          everyone voting is a real person. You can be anonymous,
          but you must be real and unique.
        </p>
        <p style={{margin: '10px 0'}}>
          You can get started with just an email.
        </p>

        <TextField //hintText="Cell phone number / email"
          floatingLabelText="Email address"
          floatingLabelFocusStyle={styles.floatingLabelText}
          style={{width: '100%'}}
          value={props.email}
          onChange={(e, newValue) => props.handleInput('email', newValue)}
          errorText={props.emailProblem}
          errorStyle={styles.errorStyle}
          /><br />
        <TextField //hintText="Password"
          floatingLabelText="Password"
          floatingLabelFocusStyle={styles.floatingLabelText}
          type="password"
          style={{width: '100%'}}
          value={props.password}
          errorText={props.passwordValidProblem}
          errorStyle={styles.errorStyle}
          onChange={(e, newValue) => props.handleInput('password', newValue)}
          />
        <Checkbox onCheck={props.makeAnonimous}
            label='Make my answers anonymous by default'
            labelPosition='right'
            style={{margin: '10px 0px'}}
            labelStyle={{fontSize: '0.8rem', fontWeight: 'bold'}}
            value={props.anonymous}
            checked={props.anonymous}
            />
        <p style={{textAlign: 'center', fontSize: '12px', textAlign: 'left'}}>
          If you are hoping to represent people or let people
          copy your votes, you should probably leave unticked.
        </p>

        <RaisedButton
          label={<span className='fbMockButton'>create my account</span>}
          primary={true}
          onTouchTap={props.nextPage}
          buttonStyle={{backgroundColor: '#1B8AAE'}}
          style={{width: '100%'}}
        />

      </Paper>
    </div>
  )
}

export default Page2;
