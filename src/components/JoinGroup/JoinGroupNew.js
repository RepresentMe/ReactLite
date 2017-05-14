import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import axios from 'axios';
import TextField from 'material-ui/TextField';
import { cyan600, grey100 } from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import LinearProgress from 'material-ui/LinearProgress';
import MessengerPlugin from 'react-messenger-plugin';
import Checkbox from 'material-ui/Checkbox';
import MessengerCheckboxPlugin from '../MessengerCheckboxPlugin';
import { observer, inject } from "mobx-react";
import GeoService from '../../services/GeoService';
import DynamicConfigService from '../../services/DynamicConfigService';

import JoinGroupPage1 from './JoinGroupPage1';
import JoinGroupPage2 from './JoinGroupPage2';

const styles = {
  floatingLabelText: {
    color: cyan600,
  }
}

const roundUp = (x) => {
    if(x < 10) {
      return 10;
    }
    var y = Math.pow(10, x.toString().length-1);
    x = (x/y);
    x = Math.ceil(x);
    x = x*y;
    return x;
}

@inject("UserStore") @observer export default class JoinGroup extends Component {

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
      postcode: '',
      address: '',
      emailExists: false,
      agreedTerms: false,
      problems: [],
      joinComplete: false,
      stepIndex: 0,
      groupLogo: null,
      followingGroup: false,
      sharingEmail: false,
      group: null,
      joinReason: ''
    }
  this.problemList = {
      fbProblem: 'Advise you to agree privacy policy first',
      emailProblem: "Please check you've entered a valid email address",
      passwordValidProblem: 'Password should be at least 8 characters long',
      passwordMatchedProblem: "Password confirmation doesn't match the password",
      postcodeProblem: 'Please enter a valid postcode',
      dobProblem: 'Please enter a valid date of birth',
      nameProblem: 'Please provide first name and last name',
      genderProblem: "Please select your gender, or choose 'I would rather not say'"
    }
  }

  componentWillMount() {
    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
    let groupId = parseInt(this.props.match.params.groupId);
    window.API.get("/api/groups/" + groupId + "/")
      .then((response) => {
        console.log('GROUP', response.data)
        this.setState({group: response.data});
        if(response.data.my_membership) {
          this.setState({joinComplete: true})
        }
      });
  }

  handleNext = () => {
    const {stepIndex} = this.state;
    console.log('handleNext', stepIndex)
    if (stepIndex === 0){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: stepIndex >= 2,
        problems: []
      });
    }
    else if (stepIndex === 1 && this.attemptJoin()){
      this.setState({
        stepIndex: stepIndex + 1,
        joinComplete: true,
        problems: []
      });
      this.joinGroup();
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
  handleCheck = (e, value) => {
    e.preventDefault();
    switch(value){
      case 'followGroup': {
        const followingGroup = !this.state.followingGroup;
        return this.setState({followingGroup});
      }
      case 'shareEmail': {
        const sharingEmail = !this.state.sharingEmail;
        return this.setState({sharingEmail});
      }
      default: return
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
  redirectToLogin = () => {
    const email = this.state.email;
    if (email) this.props.history.push("/login/" + this.dynamicConfig.encodeConfig() + "/" + encodeURIComponent(email))
    else this.props.history.push("/login/" + this.dynamicConfig.encodeConfig())
  }

  joinGroup = () => {
    window.API.post("/api/groups/" + this.state.group.id + "/join/")
      .then((response) => {
        this.setState({joinComplete: true});
      })
      .catch((error) => {
        let problems = this.state.problems;
        this.setState({problems: problems.concat([JSON.stringify(error.response.data)])})
      })
    }

  attemptJoin = () => {
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
    if(this.state.firstName.length < 1 || this.state.lastName.length < 1) {
      problems.push(this.problemList.nameProblem);
    }

    if(!this.state.postcode || this.state.postcode.length < 2 || this.state.postcode.length > 8) {
      problems.push(this.problemList.postcodeProblem);
    }

    if(problems.length !== 0) {
      this.setState({problems});
    } else {

      GeoService.checkPostcode(this.state.tpostcode)
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
          }).then((response) => {
            this.props.UserStore.setupAuthToken(response.data.auth_token);
            return true;
          }).catch((error)=> {
            this.setState({problems: [JSON.stringify(error.response.data)]})
            return false;
          })

        })
        .catch((error) =>{
          this.setState({problems: [JSON.stringify(error.response.data)]})
          return false;
        });
    }
  }

  generateUsername = () => {
    return (this.state.firstName.toLowerCase() + "_" + this.state.lastName.toLowerCase()).replace(/[`~!@#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') + Math.floor(Math.random() * 100);
  }

  render() {

    if(!this.state.group) {
      return null;
    }

    let memberGoal = roundUp(this.state.group.member_count);
    console.log('this.state', this.state)
    const randomPic = `./img/pic${Math.floor(Math.random()*7)}.png`;
    const groupLogo = this.state.group.image ? this.state.group.image.replace("localhost:8000", "represent.me") : randomPic;

    return (
      <div style={{height: '100%'}}>
      {this.state.joinComplete ? <div></div> ://this.redirectToLogin() :
        <div>
        {this.state.stepIndex === 0 &&
          <div>
            <JoinGroupPage1
              groupLogo={groupLogo}
              groupName={this.state.group.name}
              followingGroup={this.state.followingGroup}
              sharingEmail={this.state.sharingEmail}
              handleCheck={(e, value) => this.handleCheck(e, value)}
              facebookCallback={this.facebookCallback}
              displayProblem={this.displayProblem}
              //problem={this.state.problems[0]}
              redirectToLogin={this.redirectToLogin}
              nextPage={this.handleNext}
            />
        </div>}

        {this.state.stepIndex === 1 &&
          <div>
          <Paper zDepth={0} className='containerStyle'>
            <h1>Join us</h1>
            <p style={{fontSize: '12px', margin: '5px 0', maxWidth: 420}}>
              <span style={{color: cyan600}}>
                {this.state.group.member_count.toLocaleString()}
              </span> members
            </p>
            <LinearProgress mode="determinate"
              max={memberGoal}
              value={this.state.group.member_count}
              color={ cyan600 }
              style={{backgroundColor: grey100, height: '8px'}}
            />
            <p style={{fontSize: '12px', textAlign: 'right', margin: '5px 0', maxWidth: 420}}>
              <span style={{color: cyan600}}>
              {(memberGoal - this.state.group.member_count).toLocaleString()}
            </span> needed to reach <span style={{color: cyan600}}>{memberGoal.toLocaleString()}</span></p>
          </Paper>
          <JoinGroupPage2
            email={this.state.email}
            password={this.state.password}
            passwordValid={this.state.passwordValid}
            handleInput={this.handleInput}
            nextPage={this.handleNext}
            facebookCallback={this.facebookCallback}
            emailProblem={this.state.problems && this.state.problems.includes(this.problemList.emailProblem) ? this.problemList.emailProblem : ''}
            passwordValidProblem={this.state.problems && this.state.problems.includes(this.problemList.passwordValidProblem) ? this.problemList.passwordValidProblem : ''}
            agreedTerms={this.agreedTerms}
            agreedTermsValue={this.state.agreedTerms}
            joinReason={this.state.joinReason}
            problems={this.state.problems}
            displayProblem={this.displayProblem}
            redirectToLogin={this.redirectToLogin}
            groupName={this.state.group.name}
            emailExists={this.state.emailExists}
            joinComplete={this.state.joinComplete}
          />
        </div>}

        {/* <Dialog open={this.state.emailExists}>
          <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to join this group."}</p>
          <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={this.redirectToLogin} />
        </Dialog>

        <Dialog open={this.state.joinComplete}>
          <p style={{fontWeight: 'bold'}}>{"You're a member of " + this.state.group.name}</p>
          <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={this.redirectToLogin} />
        </Dialog> */}

        {/* <Dialog open={this.props.UserStore.userData.has("id") && !this.state.joinComplete}>
          <p>Welcome back, <b>{this.props.UserStore.userData.get("first_name")}</b>{". Would you like to join the " + this.state.group.name + " group on Represent?"}</p>
          <FlatButton label={"Join " + this.state.group.name} primary style={{width: '100%'}} backgroundColor={grey100} secondary onClick={() => this.joinGroup()} />
        </Dialog> */}
      </div>
    }
    </div>
  )}}
