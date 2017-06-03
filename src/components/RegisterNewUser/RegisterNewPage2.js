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
    <div className="accountmgmt">
      <Paper zDepth={0} className='containerStyle'>
      <div style={{textAlign: 'center'}}>
      <img src="/static/media/represent_white_outline.dbff67a6.svg" style={{ height: 60, margin: '10px auto'}} />
      <h2 style={{margin: '10px 0'}}>
          Let's get started!
        </h2>
        </div>
        <p style={{margin: '10px 0', color: '#999'}}>
          It's important to know that
          everyone voting is a real person. You can vote anonymously,
          but you must be real and unique.
        </p>

        <TextField //hintText="Cell phone number  email"
          floatingLabelText="Email address"
          floatingLabelFocusStyle={styles.floatingLabelText}
          style={{width: '100%'}}
          value={props.email}
          onChange={(e, newValue) => props.handleInput('email', newValue)}
          errorText={props.emailProblem}
          errorStyle={styles.errorStyle}
          /><br />
        <TextField
          hintText="Must be at least 6 characters long!"
          floatingLabelText="Password"
          floatingLabelFocusStyle={styles.floatingLabelText}
          type="password"
          style={{width: '100%'}}
          value={props.password}
          errorText={props.passwordValidProblem}
          errorStyle={styles.errorStyle}
          onChange={(e, newValue) => props.handleInput('password', newValue)}
          />
        {/* <Checkbox onCheck={props.makeAnonimous}
            label='Make my answers anonymous by default'
            labelPosition='right'
            style={{margin: '10px 0px'}}
            labelStyle={{fontSize: '0.8rem', fontWeight: 'bold'}}
            value={props.anonymous}
            checked={props.anonymous}
            /> */}
        {/* <p style={{textAlign: 'center', fontSize: '12px', textAlign: 'left'}}>
          If you are hoping to represent people or let people
          copy your votes, you should probably leave unticked.
        </p> */}

        <RaisedButton
          label={<span className='fbMockButton'>create my account</span>}
          primary={true}
          onTouchTap={props.nextPage}
          buttonStyle={{backgroundColor: '#1B8AAE'}}
          style={{width: '100%', marginTop: 20, marginBottom: 20 }}
        />

      </Paper>
    </div>
  )
}

export default Page2;
