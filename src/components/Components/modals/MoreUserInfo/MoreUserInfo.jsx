import React, { Component } from 'react';
//import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";

// import { Link } from 'react-router-dom';
// import Tappable from 'react-tappable';

// import Slider from 'material-ui/Slider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
// import LinearProgress from 'material-ui/LinearProgress';
import { white, cyan600, grey300, orange500 } from 'material-ui/styles/colors';
// import ReactMarkdown from 'react-markdown';
import Dialog from 'material-ui/Dialog';

// import DateOfBirth from "../../../DateOfBirth";
// import SelectField from 'material-ui/SelectField';
// import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import GeoService from '../../../../services/GeoService';
import Autocomplete from 'react-google-autocomplete';



const autocompleteStyle = {
  height: '44px',
  fontSize: '15px',
  borderTop: 0,
  width: '100%',
  zIndex: 99999999,
  borderLeft: 0,
  borderRight: 0,
  borderBottom: '1px solid #e4e4e4',
  color: '#444'
}


const styles = {
  dialogRoot: { 
  },
  dialogContent: { 
    padding: 0, 
  },

  dialogBody: {
    padding: 0,
  },
  radioButton: {
    fontSize: 13, 
  },
  floatingLabelText: {
    color: '#444'
  }
}



export default @observer @inject("UserStore") class MoreUserInfo extends Component {

  constructor() {
    super();

    this.state = {
      ddDOB: null,
      ddGender: '',
      txtPostcode: "",
      address: null,
      checkedPostcode: false,
      step: 0,
      problems: [],
      shown: false,
      age: ''
    }
    this.problemList = {
      postcodeProblem: 'Please enter a valid postcode',
      dobProblem: 'Please enter valid age',
      genderProblem: "Please select your gender or choose 'Rather not say'"
    }
  }

  componentWillUpdate(nextProps){
    if (this.state.shown != nextProps.shown && nextProps.user){
      console.log(nextProps)
      this.setState({ ddDOB: nextProps.user.dob, ddGender: nextProps.user.gender, txtPostcode: nextProps.user.address, shown: true})
    }
  }

  getLocation = () => {
    this.setState({ checkedPostcode: false }, () => {

      if (this.state.txtPostcode.length < 3) {
        return false;
      }

      GeoService.checkPostcode(this.state.txtPostcode)
        .then(function (response) {
          if (response.data.status === "OK" && response.data.results[0].geometry.location) {
            this.setState({ checkedPostcode: true, lat: response.data.results[0].geometry.location.lat, lng: response.data.results[0].geometry.location.lng });
          }
        }.bind(this));
    });
  }

  updateField = (field, newValue) => {
    let newState = {};
    if (field === 'age') {
      const problems = this.state.problems.filter(p => p !== this.problemList.dobProblem);
      const d = new Date();
      let ddDOB = new Date(d.getFullYear() - newValue, 0, 2);
      ddDOB = ddDOB.toISOString().substring(0, 10)
      this.setState({ddDOB, problems})
    }
    else if (field === 'ddGender') {
      const problems = this.state.problems.filter(p => p !== this.problemList.genderProblem);
      this.setState({problems})
    }
    newState[field] = newValue;
    this.setState(newState, () => {
      // Check postcode in realtime
      if (field === "txtPostcode") {
        this.getLocation();
      }
    });
  }

  closeModal = () => {
    this.setState({
      ddDOB: null,
      ddGender: '',
      txtPostcode: "",
      address: null,
      checkedPostcode: false,
      step: 0,
      problems: [],
      shown: false,
      age: ''
    })
  }

  updateDetails = () => {

    let problems = [];

    if (!this.state.age || this.state.age < 13 || this.state.age > 120 || !this.state.ddDOB) {
      problems.push(this.problemList.dobProblem);
    }

    if (!this.state.ddGender) {
      problems.push(this.problemList.genderProblem);
    }

    if (!this.state.address || !this.state.address['geometry']) {
      problems.push(this.problemList.postcodeProblem);
    }

    if (problems.length !== 0) {
      this.setState({ problems });

      return;
    } else {

      const locLat = this.state.address['geometry']['location'].lat();
      const locLon = this.state.address['geometry']['location'].lng();
      let location = null;
      if (!!locLat) {
          location = {
              "type": "Point",
              "coordinates": [locLon, locLat]
          };
      }
      const address = this.state.address.formatted_address;

      window.API.patch("/auth/me/", {
        dob: this.state.ddDOB,
        gender: this.state.ddGender,
        address: address,
        location: location,
      }).then((response) => {
        //this.setState({ shown: false })
        this.closeModal()
      }).catch((error) => {
        console.log(JSON.stringify(error.response.data))
        this.setState({ problems: [JSON.stringify(error.response.data)] })
      });
    }
  }

  render() {

    const actions = [
      <FlatButton
        label="Skip"
        onTouchTap={this.closeModal}
      />,
      <FlatButton
        label="Count me in"
        primary={true}
        onClick={this.updateDetails}
      />,
    ];
    return (
      <Dialog
        open={this.state.shown}
        onRequestClose={this.closeModal}
        modal={false}
        contentStyle={ styles.dialogContent }
        bodyStyle={ styles.dialogBody }
        style={ styles.dialogRoot }
        actions={actions}
        autoScrollBodyContent={false}>

        <div style={{width: '90%', display: 'block', margin: '20px auto'}}>
          <p style={{ margin: 0, fontSize: 16, color: '#333'}}>How do you compare?</p>
          <p style={{ margin: 0, fontSize: 14, color: '#999', marginBottom: 8}}>Enter a few details to match to local candidates and see how others have answered.</p>

          <Autocomplete
              style={autocompleteStyle}
              onPlaceSelected={(place) => {
                this.setState({
                  address: place,
                  problems: this.state.problems.filter(p => p !== this.problemList.postcodeProblem)
                })
              }}
              types={['(regions)']}
              //componentRestrictions={{}}
              placeholder="What's your postcode?"
            />

          {/* <DateOfBirth onChange={(newValue) => this.updateField('ddDOB', newValue)} value={this.state.ddDOB} /> */}
          <TextField
            floatingLabelText="How old are you (in years)?"
            floatingLabelFocusStyle={styles.floatingLabelText}
            style={{width: '100%', color: '#444'}}
            value={this.state.age}
            onChange={(e, newValue) => this.updateField('age', newValue)}
            /><br />

            <RadioButtonGroup
              name="gender"
              onChange={(e, newValue) => this.updateField('ddGender', newValue)}
              >
              <RadioButton
                value="1"
                label="Male"
                className="radiob"
                style={styles.radioButton}
                iconStyle={{fill: cyan600}}
                labelStyle={{color: 'grey'}}
              />
              <RadioButton
                value="2"
                label="Female"
                className="radiob"
                iconStyle={{fill: cyan600}}
                style={styles.radioButton}
                labelStyle={{color: 'grey'}}
              />
              <RadioButton
                value="3"
                label="Rather not say"
                className="radiob"
                iconStyle={{fill: cyan600}}
                style={styles.radioButton}
                labelStyle={{color: 'grey'}}
              />
            </RadioButtonGroup>

            {/* <SelectField
              floatingLabelText="Gender"
              value={this.state.ddGender}
              style={{ width: '100%' }}
              onChange={(e, newIndex, newValue) => this.updateField('ddGender', newValue)}
            >
              <MenuItem value={1} primaryText="Male" />
              <MenuItem value={2} primaryText="Female" />
              <MenuItem value={3} primaryText="Rather not say" />
            </SelectField> */}

          {this.state.problems.map((problem, index) => {
            return (
              <p key={`problem-${index}`} style={{color: orange500, margin: '0px 0px 5px 0px', textAlign: 'left', fontSize: '14px'}}>{problem}</p>
            );
          })}
        </div>
      </Dialog>
    )
  }

}
