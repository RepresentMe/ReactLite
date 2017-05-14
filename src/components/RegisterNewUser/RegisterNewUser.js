import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import { grey100, cyan600 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import DynamicConfigService from '../../services/DynamicConfigService';
//import GeoService from '../../services/GeoService';

import './RegisterNewUser.css';

import Page1 from './RegisterNewPage1';
import Page2 from './RegisterNewPage2';

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
      emailChecked: false,
      emailExists: false,
      agreedTerms: false,
      problems: [],
      joinComplete: false,
      stepIndex: 0,
      anonymous: false
    }
  this.problemList = {
      fbProblem: 'Please agree to the privacy policy first',
      emailProblem: "Please check you've entered a valid email address",
      passwordValidProblem: 'Password should be at least 8 characters long',
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
    if (stepIndex === 0){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: stepIndex >= 1,
        problems: []
      });
    }
    else if (stepIndex === 1 && this.attemptNext1Page()){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: true,
        problems: []
      });
    }
  };

  handleInput = (stateProp, value) => {
    this.setState({[stateProp]: value})
    if (stateProp === 'email') {
      const problems = this.state.problems.filter(p => p !== this.problemList.emailProblem);
      this.setState({emailChecked: false, problems});
    }
    else if (stateProp === 'password' && this.state.email){
      this.setState({passwordValid: false});
      this.checkPassword(value);
      this.checkEmail();
    } else if (stateProp === 'password' && !this.state.email){
        this.setState({passwordValid: false});
        this.checkPassword(value);
    }
  }
  agreedTerms = () => {
    const agreedTerms = !this.state.agreedTerms;
    const problems = this.state.problems.filter(p => p !== this.problemList.fbProblem)
    this.setState({agreedTerms, problems})
  }
  facebookCallback = (result) => {
    if(result.accessToken) {
      this.props.UserStore.facebookLogin(result.accessToken);
      this.props.history.push(this.dynamicConfig.getNextRedirect())
    }
  }
  displayProblem = () => {
    if (!this.state.problems.includes(this.problemList.fbProblem)){
      const problems = [...this.state.problems, this.problemList.fbProblem];
      this.setState({problems})
    };
  }
  checkEmail = () => {
    if (!this.state.emailChecked){
    window.API.get('/auth/check_email/?email=' + this.state.email)
      .then((response) => {
        console.log('response', response)
        if(response.data.result) {
          this.setState({emailExists: true, emailChecked: true});
          return true;
        }
        this.setState({emailChecked: true});
        return false;
      });
  }}
  checkPassword = (value) => {
    if (value){
      if (value.length > 8) {
        const problems = this.state.problems.filter(p => p !== this.problemList.passwordValidProblem);
        this.setState({passwordValid: true, problems})
        return true;
      }
    }
    return false;
  }
  generateUsername = () => {
    return (this.state.firstName.toLowerCase() + "_" + this.state.lastName.toLowerCase()).replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + Math.floor(Math.random() * 100);
  }
  redirectToLogin = () => {
    const email = this.state.email;
    if (email) this.props.history.push("/loginuser/" + encodeURIComponent(email))
    else this.props.history.push("/loginuser" + this.dynamicConfig.getNextRedirect())
  }
  makeAnonimous = () => {
    const anonymous = !this.state.anonymous;
    this.setState({anonymous});
  }

  //attempt register user
  attemptNext1Page = () => {
    let problems = [];
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(!re.test(this.state.email)){
      if (!problems.includes(this.problemList.emailProblem)){
      problems.push(this.problemList.emailProblem);
      }
    }
    if (!this.state.passwordValid){
      problems.push(this.problemList.passwordValidProblem);
    }
    if (problems.length !== 0) {
      this.setState({problems});
      return false;
    } else {

      if (problems.length !== 0) {
        this.setState({problems});
        return false; }

      if (this.checkEmail()) {
        return false;

      } else {
        window.API.post("/auth/register/", {
          email: this.state.email,
          username: this.generateUsername(),
          password: Math.floor(Math.random() * 1000000000000),
          //private mode
          anonymous: this.state.anonymous
        }).then((response) => {
          console.log('response from /auth/register/', response)
          this.props.UserStore.setupAuthToken(response.data.auth_token)
            .then(() => {
              this.redirectToLogin();
              return true;
            })
            .catch((error) => {
              console.log(error)
              return false;
            })
        }).catch((error) => {
          this.setState({problems: [JSON.stringify(error.response.data)]})
          return false;
        })
        return true;
      }
    }
  }


  render(){
    const {joinComplete, stepIndex} = this.state;
    console.log('this.state', this.state)
    return (
      <div>

        <div>
          {joinComplete ? (
            this.redirectToLogin()
          ) : (
            <div>
              {stepIndex === 0 && <Page1
                handleInput={this.handleInput}
                facebookCallback={this.facebookCallback}
                agreedTerms={this.agreedTerms}
                agreedTermsValue={this.state.agreedTerms}
                displayProblem={this.displayProblem}
                problem={this.state.problems[0]}
                redirectToLogin={this.redirectToLogin}
                nextPage={this.handleNext}
                />}
              {stepIndex === 1 && <Page2
                email={this.state.email}
                password={this.state.password}
                passwordValid={this.state.passwordValid}
                handleInput={this.handleInput}
                anonymous={this.state.anonymous}
                makeAnonimous={this.makeAnonimous}
                nextPage={this.handleNext}
                emailProblem={this.state.problems && this.state.problems.includes(this.problemList.emailProblem) ? this.problemList.emailProblem : ''}
                passwordValidProblem={this.state.problems && this.state.problems.includes(this.problemList.passwordValidProblem) ? this.problemList.passwordValidProblem : ''}
                />}

              {this.state.emailExists &&

                <Dialog open={this.state.emailExists}>
                  <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to continue."}</p>
                  <FlatButton
                  label="Login"
                  style={{width: '100%'}}
                  backgroundColor={grey100}
                  secondary onTouchTap={() => {
                    this.props.history.push("/loginuser/" + encodeURIComponent(this.state.email))
                  }}
                  />
                </Dialog>}
            </div>
          )}
        </div>

      </div>
    );
  }
}
export default RegisterComponent;
