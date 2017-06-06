import React from 'react';
import { observer, inject } from "mobx-react";

import { grey100 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import IntroCarousel from '../IntroCarousel';
import DynamicConfigService from '../../services/DynamicConfigService';
//import GeoService from '../../services/GeoService';

import './RegisterNewUser.css';

import Page1 from './RegisterNewPage1';
import Page2 from './RegisterNewPage2';

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
      anonymous: false,
      user_count: '17,394',
      modalOpened: false
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
    this.dynamicConfig = DynamicConfigService;
  }

  componentWillMount() {
    const raw_config = this.dynamicConfig.getDynamicConfig(this.props.history.location.pathname);
    if(raw_config) {
      this.dynamicConfig.setConfigFromRaw(raw_config)
    }
  }

  componentDidMount(){
    window.API.get('/api/user_count/')
      .then((response) => {
        if(response.data.result) {
          this.setState({user_count: response.data.result});
        }
      }).catch(e => console.log(e));
  }

  handleNext = () => {
    const {stepIndex} = this.state;

    // this.dynamicConfig.setConfigFromRaw(this.dynamicConfig.encodeConfig(this.dynamicConfig.getNextRedirect()))

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
      this.redirectToLogin()
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
      if (value.length > 7) {
        const problems = this.state.problems.filter(p => p !== this.problemList.passwordValidProblem);
        this.setState({passwordValid: true, problems})
        return true;
      }
    }
    return false;
  }
  generateUsername = (email) => {
    // return (this.state.firstName.toLowerCase() + "_" + this.state.lastName.toLowerCase()).replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + Math.floor(Math.random() * 100);
    return `${email.substring(0, email.indexOf('@'))}_${Math.floor(Math.random() * 100)}`;
  }
  redirectToLogin = () => {
    const email = this.state.email;
    if (email) this.props.history.push("/loginuser/" + this.dynamicConfig.encodeConfig(this.dynamicConfig.getNextRedirect()) + "/" + encodeURIComponent(email))
    else this.props.history.push("/loginuser/" + this.dynamicConfig.encodeConfig(this.dynamicConfig.getNextRedirect()))
  }
  makeAnonimous = () => {
    const anonymous = !this.state.anonymous;
    this.setState({anonymous});
  }
  toggleIntro = () => {
    //e.preventDefault()
    const modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
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
          username: this.generateUsername(this.state.email),
          password: this.state.password,
          agreed_terms: this.state.agreedTerms
        }).then((response) => {
          this.props.UserStore.setupAuthToken(response.data.auth_token)
            .then(() => {
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
    return (
      <div>

        <div>
            <div>
              {stepIndex === 0 && <Page1
                currentUserCount={this.state.user_count}
                handleInput={this.handleInput}
                facebookCallback={this.facebookCallback}
                agreedTerms={this.agreedTerms}
                agreedTermsValue={this.state.agreedTerms}
                displayProblem={this.displayProblem}
                problem={this.state.problems[0]}
                redirectToLogin={this.redirectToLogin}
                nextPage={this.handleNext}
                toggleIntro={() => this.toggleIntro()}
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
                  secondary onTouchTap={() => this.redirectToLogin()}
                  />
                </Dialog>}

                <IntroCarousel
                  modalOpened={this.state.modalOpened}
                  toggleIntro={this.toggleIntro}/>
            </div>
        </div>

      </div>
    );
  }
}
export default RegisterComponent;
