import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import axios from 'axios';
import MessengerPlugin from 'react-messenger-plugin';
import MessengerCheckboxPlugin from '../MessengerCheckboxPlugin';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { cyan600, grey100 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import DateOfBirth from "../DateOfBirth";
import GeoService from '../../services/GeoService';
import DynamicConfigService from '../../services/DynamicConfigService';


const styles = {
  floatingLabelText: {
    color: cyan600,
  }
}

@inject("UserStore") @observer export default class Join extends Component {

  constructor() {
    super();
    this.state = {
      txtEmail: '',
      txtFirstName: '',
      txtLastName: '',
      txtPostcode: '',
      ddGender: null,
      ddDOB: null,
      emailExists: false,
      agreedTerms: false,
      problems: [],
      joinComplete: false,
    }

    this.attemptJoin = this.attemptJoin.bind(this);
  }

  componentWillMount() {
    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }

  render() {

    return (
      <div style={{height: '100%'}}>
        <Paper zDepth={0} style={{padding: '10px 20px', width: '100%', marginLeft: 'auto', marginRight: 'auto'}}>

          <h1 style={{marginBottom: 0}}>Join Represent</h1>

          {this.dynamicConfig.getNextRedirect() && <a onClick={() => this.props.history.push(this.dynamicConfig.getNextRedirect())}>&larr; {"back"}</a>}

          <TextField
            floatingLabelText="Email address"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateField('txtEmail', newValue)}
            errorText={!this.state.txtEmail && " "}
            />

          <TextField
            floatingLabelText="Postcode"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateField('txtPostcode', newValue)}
            errorText={!this.state.txtPostcode && " "}
            />

          <DateOfBirth onChange={(newValue) => this.updateField('ddDOB', newValue)} value={this.state.ddDOB} errorText={!this.state.ddDOB && " "}/>

          <SelectField
            floatingLabelText="Gender"
            value={this.state.ddGender}
            style={{width: '100%', marginTop: '-15px', overflow: 'hidden'}}
            onChange={(e, newIndex, newValue) => this.updateField('ddGender', newValue)}
            errorText={!this.state.ddGender && " "}
          >
            <MenuItem value={1} primaryText="Male" />
            <MenuItem value={2} primaryText="Female" />
            <MenuItem value={3} primaryText="Other" />
            <MenuItem value={0} primaryText="I would rather not say" />
          </SelectField>

          <MessengerCheckboxPlugin
            appId={String(window.authSettings.facebookId)}
            pageId={String(window.authSettings.facebookPageId)}
            />
          <Checkbox checked={this.state.agreedTerms} onCheck={() => this.setState({agreedTerms: !this.state.agreedTerms})} style={{float: 'left', width: '24px', color: cyan600}}/>
          <p style={{margin: '0', fontSize: '14px'}}>By joining you agree to the <a href="https://represent.me/legal/terms/">terms and conditions</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a></p>

          {this.state.problems.map((problem, index) => {
            return (
              <p key={index} style={{color: 'red', margin: '0', marginTop: '5px', fontSize: '14px'}}>{problem}</p>
            );
          })}

          <FlatButton onClick={this.attemptJoin} disabled={!this.state.agreedTerms} label="Join" style={{width: '100%', marginTop: '10px'}} backgroundColor={grey100} secondary />

        </Paper>



        <Dialog open={this.state.emailExists}>
          <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to continue."}</p>
          <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={() => {
            this.props.history.push("/login/" + this.dynamicConfig.encodeConfig() + "/" + encodeURIComponent(this.state.txtEmail))
          }} />
        </Dialog>

        <Dialog open={this.props.UserStore.userData.has("id")}>
          <p style={{fontWeight: 'bold'}}>{"Sign up was successful, welcome to Represent!"}</p>
          <FlatButton label="Continue" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={() => this.props.history.push(this.dynamicConfig.getNextRedirect())} />
        </Dialog>

      </div>
    )
  }

  updateField(field, newValue) {

    if((field === 'txtPostcode' || field === 'txtFirstName') && newValue.length === 1) { // User has completed entering email
      this.checkEmail();
    }

    let newState = {};
    newState[field] = newValue;
    this.setState(newState);
  }

  checkEmail() {

    window.API.get('/auth/check_email/?email=' + this.state.txtEmail)
      .then(function (response) {
        if(response.data.result === true) {
          this.setState({emailExists: true});
        }
      }.bind(this));

  }

  attemptJoin() {

    let problems = [];

    if(!RegExp("[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").test(this.state.txtEmail)) {
      problems.push("Please check you've entered a valid email address");
    }

    if(this.state.txtPostcode.length < 2 || this.state.txtPostcode.length > 8) {
      problems.push("Please enter a valid postcode!");
    }

    if(this.state.ddDOB === null) {
      problems.push("Please enter a valid date of birth!");
    }

    if(this.state.ddGender === null) {
      problems.push("Please select your gender, or choose 'I would rather not say'");
    }

    if(problems.length !== 0) {
      this.setState({problems});
    }else {

      GeoService.checkPostcode(this.state.txtPostcode)
        .then(function(response) {

          let location = null;

          if(response.data.status === "OK") {
            let raw_location = response.data.results[0].geometry.location;
            location =  {
              "type": "Point",
              "coordinates": [raw_location.lng, raw_location.lat]
            };
          }

          window.API.post("/auth/register/", {
            email: this.state.txtEmail,
            first_name: this.state.txtFirstName,
            last_name: this.state.txtLastName,
            address: this.state.txtPostcode,
            username: this.generateUsername(),
            password: Math.floor(Math.random() * 1000000000000),
            location,
            gender: this.state.ddGender,
            dob: this.state.ddDOB.substring(0, 10),
          }).then(function(response) {
            this.props.UserStore.setupAuthToken(response.data.auth_token)
              .then(() => {
                this.props.history.push(this.dynamicConfig.getNextRedirect())
              })
              .catch((error) => {
                console.log(error)
              })

          }.bind(this)).catch(function(error) {
            this.setState({problems: [JSON.stringify(error.response.data)]})
          }.bind(this))

        }.bind(this))
        .catch(function(error) {
          this.setState({problems: [JSON.stringify(error.response.data)]})
        }.bind(this));
    }

  }

  generateUsername() {
    return (this.state.txtFirstName.toLowerCase() + "_" + this.state.txtLastName.toLowerCase()).replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + Math.floor(Math.random() * 100);
  }

}
