import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import Tappable from 'react-tappable';
import './QuestionFlow.css';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import { white, cyan600, grey300 } from 'material-ui/styles/colors';
import ReactMarkdown from 'react-markdown';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';
import DateOfBirth from "../DateOfBirth";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import GeoService from '../../services/GeoService';

export default @inject("UserStore") @observer class CompleteProfile extends Component {

  constructor() {
    super();

    this.state = {
      ddDOB: null,
      ddGender: null,
      txtPostcode: "",
      checkedPostcode: false,
      postcodeLocation: {},
      step: 0,
      problems: [],
      shown: false,
      checkedProfile: false,
    }

    this.updateDetails = this.updateDetails.bind(this);
    this.onContinue = this.onContinue.bind(this);
    this.valueIsAllowed = this.valueIsAllowed.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  componentWillMount() {
    this.checkProfile();
  }

  componentWillUpdate() {
    this.checkProfile();
  }

  checkProfile() {
    if(this.props.UserStore.userData.has("id") && !this.state.checkedProfile) {
      let profile = this.props.UserStore.userData.toJS();
      if(profile.dob === null || profile.gender === 0 || profile.address === "") {
        this.setState({
          checkedProfile: true,
          shown: true,
          ddDOB: profile.dob || null,
          ddGender: profile.gender || null,
          txtPostcode: profile.address,
        }, () => {
          this.getLocation();
        });
      }
    }
  }

  getLocation() {
    this.setState({checkPostcode: false}, () => {

      if(this.state.txtPostcode.length < 3) {
        return;
      }

      GeoService.checkPostcode(this.state.txtPostcode)
        .then(function(response) {
          if(response.data.status === "OK" && response.data.results[0].geometry.location) {
            this.setState({checkedPostcode: true, lat: response.data.results[0].geometry.location.lat, lng: response.data.results[0].geometry.location.lng});
          }
        }.bind(this));
    });
  }

  updateField(field, newValue) {
    let newState = {};
    newState[field] = newValue;
    this.setState(newState, () => {
      // Check postcode in realtime
      if(field === "txtPostcode") {
        this.getLocation();
      }
    });
  }

  render() {
    return (
      <Dialog
        title="Please complete your profile"
        open={this.state.shown}
        autoScrollBodyContent={true}>

        {this.state.step === 0 && <DateOfBirth onChange={(newValue) => this.updateField('ddDOB', newValue)} value={this.state.ddDOB}/>}

        {this.state.step === 1 &&
          <SelectField
            floatingLabelText="Gender"
            value={this.state.ddGender}
            style={{width: '100%'}}
            onChange={(e, newIndex, newValue) => this.updateField('ddGender', newValue)}
          >
            <MenuItem value={1} primaryText="Male" />
            <MenuItem value={2} primaryText="Female" />
            <MenuItem value={3} primaryText="Other" />
          </SelectField>
        }

        {this.state.step === 2 &&
          <TextField
            floatingLabelText="Postcode"
            style={{width: '100%'}}
            floatingLabelFocusStyle={{color: cyan600}}
            defaultValue={this.state.txtPostcode}
            onChange={(e, newValue) => this.updateField('txtPostcode', newValue)}
            />
        }

        {this.state.problems.map((problem, index) => {
          return (
            <p key={index} style={{color: 'red', margin: '0', marginBottom: '5px', fontSize: '14px'}}>{problem}</p>
          );
        })}

        <RaisedButton label="Continue" onClick={this.onContinue} disabled={!this.valueIsAllowed()}/>
        <p>{"We've noticed your profile is incomplete. Completing your profile helps your decision makers take us more seriously, please take a moment to review and complete the data missing from your profile."}</p>

      </Dialog>
    )
  }

  valueIsAllowed() {
    if(this.state.step === 0 && this.state.ddDOB) {
      return true;
    }else if(this.state.step === 1 && this.state.ddGender) {
      return true;
    }else if(this.state.step === 2) {
      return this.state.checkedPostcode;
    }

    return false;
  }

  onContinue() {
    if(this.state.step >= 2) {
      this.updateDetails();
    }else {
      this.setState({step: this.state.step + 1});
    }
  }

  updateDetails() {

    let problems = [];

    if(this.state.ddDOB === null) {
      problems.push("Please enter a valid date of birth!");
    }

    if(this.state.ddGender === null) {
      problems.push("Please select your gender, or choose 'I would rather not say'");
    }

    if(this.state.txtPostcode.length < 2 || this.state.txtPostcode.length > 8) {
      problems.push("Please enter a valid postcode!");
    }

    if(problems.length !== 0) {
      this.setState({problems});
      return;
    }

    let googleLocation =  {
      "type": "Point",
      "coordinates": [this.state.lng, this.state.lat],
    };

    window.API.patch("/auth/me/", {
      dob: this.state.ddDOB.substring(0, 10),
      gender: this.state.ddGender,
      address: this.state.txtPostcode,
      location: googleLocation,
    }).then((response) => {
      this.setState({shown: false})
    }).catch((error) => {
      this.setState({problems: [JSON.stringify(error.response.data)]})
    });
  }

}
