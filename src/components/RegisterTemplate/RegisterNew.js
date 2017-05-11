import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import FacebookLogin from 'react-facebook-login';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { grey100, cyan600 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {Step, Stepper, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import DynamicConfigService from '../../services/DynamicConfigService';
import GeoService from '../../services/GeoService';

import './RegisterNew.css';
import smallLogo from './represent_white_outline.svg';
import Page1 from './RegisterNewPage1';
import Page2 from './RegisterNewPage2';
import Page3 from './RegisterNewPage3';

const styles = {
  containerStyle: {
    padding: '10px 20px',
    minWidth: '320px',
    maxWidth: '500px',
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
    width: '100%',
  },
  liHeaderStyle: {
    fontSize: '0.9rem',
    textAlign: 'left',
    textDecoration: 'underline'
  },
  liStyle: {
    fontSize: '0.8rem',
    fontStyle: 'italic',
    textDecoration: 'none'
  },
  problemStyle: {
    fontSize: '0.8rem',
    fontStyle: 'italic',
    textDecoration: 'none',
    color: 'red'
  }
}

@inject("UserStore") @observer class RegisterComponent extends React.Component {
  constructor(){
    super()

  this.state = {
      email: '',
      username: '',
      phoneNumer: '',
      firstName: '',
      lastName: '',
      password: '',
      passwordValid: false,
      passwordMatched: false,
      postcode: '',
      address: '',
      gender: '',
      dob: null,
      photo: null,
      emailExists: false,
      agreedTerms: false,
      problems: [],
      joinComplete: false,
      stepIndex: 0,
      openTips: false
    }
  this.problemList = {
      fbProblem: 'Advise you to agree privacy policy first',
      emailProblem: "Please check you've entered a valid email address",
      passwordValidProblem: 'Password should be at least 8 characters long. Please revise and try again',
      passwordMatchedProblem: "Password confirmation doesn't match the password. Please revise and try again",
      postcodeProblem: 'Please enter a valid postcode',
      dobProblem: 'Please enter a valid date of birth',
      nameProblem: 'Please provide first and last name',
      genderProblem: "Please select your gender, or choose 'I would rather not say'"
    }
  }

  componentWillMount() {
    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    if (stepIndex === 0 && this.attemptNext1Page()){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: stepIndex >= 2,
        problems: []
      });
    }
    else if (stepIndex === 1 && this.attemptNext2Page()){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: stepIndex >= 2,
        problems: []
      });
    }
    else if (stepIndex === 2){
      //this.props.history.push(this.dynamicConfig.getNextRedirect());
    }
  };
  handlePrev = () => {
    const {stepIndex} = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1, problems: []});
    }
  };
  handleInput = (stateProp, value) => {
    this.setState({[stateProp]: value})
    if (stateProp === 'password'){
      this.setState({passwordMatched: false, passwordValid: false})
      this.checkPassword(value);
    }
  }
  openTips = () => {
    const openTips = !this.state.openTips;
    this.setState({openTips})
  }
  agreedTerms = () => {
    const agreedTerms = !this.state.agreedTerms;
    const problems = this.state.problems.filter(p => p !== this.problemList.fbProblem)
    this.setState({agreedTerms, problems})
  }
  facebookCallback = (result) => {
    if(result.accessToken) {
      this.props.UserStore.facebookLogin(result.accessToken);
    }
  }
  displayMsgFB = () => {
    if (!this.state.problems.includes(this.problemList.fbProblem)){
      const problems = [...this.state.problems, this.problemList.fbProblem];
      this.setState({problems})
    };
  }
  checkEmail = () => {
    window.API.get('/auth/check_email/?email=' + this.state.email)
      .then(function (response) {
        console.log('response', response)
        if(response.data.result) {
          this.setState({emailExists: true});
        }
      });
  }
  checkPassword = (value) => {
    if (value){
      if (value.length > 8) {
        this.setState({passwordValid: true})
        return true;
      }
    }
    return false;
  }
  checkPasswordMatch = (newValue) => {
    if (this.state.password.length && newValue.length){
      this.setState({passwordMatched: this.state.password === newValue})
      return this.state.password === newValue;
    }
    return false;
  }
  getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        const txt0 = [
            'You can register with your cellphone number or email',
            'Password should be longer than 8 symbols',
            'Kindly agree on privacy policy to proceed with sign up!'
        ]
        return (
          <div>
            <a style={styles.liHeaderStyle} onTouchTap={this.openTips}>Tips:</a>
            {this.state.openTips && <ul>
              {txt0.map((txt, i) => <li key={`case0-${i}`} style={styles.liStyle}>{txt}</li>)}
            </ul>}
          </div>
        );
      case 1:
      const txt1 = [
          'All fields are required',
          'You have to be at least 13 to register for our service'
      ]
      return (
        <div>
          <a style={styles.liHeaderStyle} onTouchTap={this.openTips}>Tips:</a>
          {this.state.openTips && <ul>
            {txt1.map((txt, i) => <li key={`case0-${i}`} style={styles.liStyle}>{txt}</li>)}
          </ul>}
        </div>
      );
      case 2:

        return (
          <div>
            <p>{`Dear ${this.state.firstName} ${this.state.lastName}!`}</p>
          </div>
        );

      default:
        return 'You\'re a long way from home sonny jim!';
    }
  }
  attemptNext1Page = () => {
    let problems = [];
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(this.state.email)){
      if (!problems.includes(this.problemList.emailProblem)){
      problems.push(this.problemList.emailProblem);
      }
    }
    if (!this.state.passwordMatched){
      problems.push(this.problemList.passwordMatchedProblem);
    }
    if (!this.state.passwordValid){
      problems.push(this.problemList.passwordValidProblem);
    }
    if (problems.length !== 0) {
      this.setState({problems});
      return false;
    } else {
      this.checkEmail();
      return true;
    }
  }
  attemptNext2Page = () => {
    let problems = [];
    if(this.state.firstName === null || this.state.lastName === null) {
      problems.push(this.problemList.nameProblem);
    }
    if(!this.state.postcode || this.state.postcode.length < 2 || this.state.postcode.length > 8) {
      problems.push(this.problemList.postcodeProblem);
    }
    if(this.state.dob === null) {
      problems.push(this.problemList.dobProblem);
    }
    if(this.state.gender === null) {
      problems.push(this.problemList.genderProblem);
    }
    if(problems.length !== 0) {
      this.setState({problems});
      return false;
    } else {

      GeoService.checkPostcode(this.state.postcode)
        .then((response) => {

          let location = null;

          if(response.data.status === "OK") {
            let raw_location = response.data.results[0].geometry.location;
            location =  {
              "type": "Point",
              "coordinates": [raw_location.lng, raw_location.lat]
            };
          }

          window.API.post("/auth/register/", {
            email: this.state.email,
            first_name: this.state.firstName,
            last_name: this.state.lastName,
            address: this.state.postcode,
            username: this.generateUsername(),
            password: Math.floor(Math.random() * 1000000000000),
            location,
            gender: this.state.gender,
            dob: this.state.dob.substring(0, 10),
          }).then((response) => {
            console.log('response', response)
            this.props.UserStore.setupAuthToken(response.data.auth_token)
              .then(() => {
                this.props.history.push(this.dynamicConfig.getNextRedirect())
              })
              .catch((error) => {
                console.log(error)
              })
          }).catch((error) => {
            this.setState({problems: [JSON.stringify(error.response.data)]})
          })
        })
        .catch((error) => {
          this.setState({problems: [JSON.stringify(error.response.data)]})
        });
      return true;
    }
  }
  attemptLogin = () => {
    this.props.UserStore.authLogin(this.state.email, this.state.password)
    .catch((error) => {
      if(error.response.data.non_field_errors) {
        this.setState({problems: ["Username / password combination not found! Please check your details and try again"]});
      }else {
        this.setState({problems: JSON.stringify(error.response.data).replace(/:/g,": ").replace(/[&\/\\#+()$~%.'"*?<>{}\[\]]/g, "").split(",")});
      }
    });
  }
  generateUsername() {
    return (this.state.firstName.toLowerCase() + "_" + this.state.lastName.toLowerCase()).replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + Math.floor(Math.random() * 100);
  }
  render(){
    const {joinComplete, stepIndex} = this.state;
    console.log('this.state', this.state)
    return (
      <Paper zDepth={1} style={styles.containerStyle}>
        <p style={{fontWeight: 'bold', margin: '10px 0'}}>
          <img src={smallLogo} style={styles.imgStyle} />
          Please register here
        </p>
        {stepIndex === 0 &&
          <div>
            <p style={{fontSize: '1rem'}}><i>Represent makes it easy to vote, debate, and delegate decisions, making democracy effective every single day.</i></p>
            <p style={{fontSize: '1rem'}}><i>Content on the Represent platform comes from a variety of curuated, 3rd party and user generated sources. To get the most out of Represent we recommend visiting <a href="https://represent.me">represent.me</a> and subscribing to the movements, unions, charities and groups you support.</i></p>
          </div>
        }
        <Stepper activeStep={stepIndex} className='stepper' style={{border: 'none', backgroundColor: 'transparent'}}>
          <Step>
            {/* <StepLabel>{stepIndex >= 0 ? 'intro' : ''}</StepLabel> */}
          </Step>
          <Step>
            {/* <StepLabel>{stepIndex >= 1 ? 'details' : ''}</StepLabel> */}
          </Step>
          <Step>
            {/* <StepLabel>{stepIndex === 2 ? 'finish' : ''}</StepLabel> */}
          </Step>
        </Stepper>
        <div>
          {joinComplete ? (
            <p>
              <a
                href="#"
                onClick={(event) => {
                  event.preventDefault();
                  this.setState({stepIndex: 0, joinComplete: false});
                }}
              >
                Click here </a> to reset the example.
            </p>
          ) : (
            <div>
              <div>{this.getStepContent(stepIndex)}</div>
              <div>
                {this.state.problems.length > 0 && this.state.problems.map((p,i)=>
                  <li style={styles.problemStyle} key={i}>{p}</li>)}
              </div>
              {stepIndex === 0 && <Page1
                handleInput={this.handleInput}
                facebookCallback={this.facebookCallback}
                email={this.state.email}
                password={this.state.password}
                agreedTerms={this.agreedTerms}
                agreedTermsValue={this.state.agreedTerms}
                displayMsgFB={this.displayMsgFB}
                checkPasswordMatch={this.checkPasswordMatch}
                passwordValid={this.state.passwordValid}
                passwordMatched={this.state.passwordMatched}
                />}
              {stepIndex === 1 && <Page2
                firstName={this.state.firstName}
                lastName={this.state.lastName}
                postcode={this.state.postcode}
                gender={this.state.gender}
                dob={this.state.dob}
                handleInput={this.handleInput}
                />}

              {this.state.emailExists &&

                <Dialog open={this.state.emailExists}>
                  <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to continue."}</p>
                  <FlatButton
                  label="Login"
                  style={{width: '100%'}}
                  backgroundColor={grey100}
                  secondary onTouchTap={() => {
                    this.props.history.push("/login/" + this.dynamicConfig.encodeConfig() + "/" + encodeURIComponent(this.state.email))
                  }}
                  />
                </Dialog>}

              <div style={{marginTop: 12, display: 'flex'}}>
                {this.state.stepIndex === 1 && <FlatButton
                  label="Back"
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12, flex: 1}}
                />}

                {stepIndex === 2 && !this.state.problems.length ? <Page3
                  attemptLogin={this.attemptLogin}
                  /> :
                  <RaisedButton
                    label={stepIndex === 1 ? 'Register' : 'Next'}
                    primary={true}
                    onTouchTap={this.handleNext}
                    style={{flex: 1}}
                    disabled={!this.state.agreedTerms}
                  />
                }

              </div>
            </div>
          )}
        </div>

      </Paper>
    );
  }
}
export default RegisterComponent;
