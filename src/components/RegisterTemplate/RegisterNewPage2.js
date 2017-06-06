import React from 'react';

import TextField from 'material-ui/TextField';
import { cyan600 } from 'material-ui/styles/colors';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DateOfBirth from "../DateOfBirth";

import './RegisterNew.css';

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
  floatingLabelText: {
    color: cyan600,
  },
  facebookLoginStyle: {
    display: 'inline-block',
    width: '100%'
  }
}

const Page2 = (props) => {

  return (
    <div style={{width: '100%', height: '100%'}}>
      <div style={{display: 'flex'}}>
        <TextField hintText="First name"
          style={{flex: 1}}
          value={props.firstName}
          onChange={(e, newValue) => props.handleInput('firstName', newValue)}
          /><br />
        <TextField hintText="Last name"
          style={{flex: 1}}
          value={props.lastName}
          onChange={(e, newValue) => props.handleInput('lastName', newValue)}
          /><br />
      </div>

      <TextField
        floatingLabelText="Postcode"
        style={{width: '100%'}}
        floatingLabelFocusStyle={styles.floatingLabelText}
        onChange={(e, newValue) => props.handleInput('postcode', newValue)}
        value={props.postcode}
        //errorText={!props.postcode && " "}
        />

      <DateOfBirth
        onChange={(newValue) => props.handleInput('dob', newValue)}
        value={props.dob}
        //errorText={!props.dob && " "}
        />

      <SelectField
        onChange={(e, newIndex, newValue) => props.handleInput('gender', newValue)}
        floatingLabelText="Gender"
        value={props.gender}
        style={{width: '100%', marginTop: '-15px', overflow: 'hidden'}}
        //errorText={!props.gender && " "}
      >
        <MenuItem value={1} primaryText="Male" />
        <MenuItem value={2} primaryText="Female" />
        <MenuItem value={3} primaryText="Other" />
        <MenuItem value={0} primaryText="I would rather not say" />
      </SelectField>

    </div>
  )
}

export default Page2;
