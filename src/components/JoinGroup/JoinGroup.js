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

const styles = {
  floatingLabelText: {
    color: cyan600,
  }
}

export default class JoinGroup extends Component {

  constructor() {
    super();

    this.state = {
      txtEmail: '',
      txtFirstName: '',
      txtLastName: '',
      txtPostcode: '',
      emailExists: false,
      agreedTerms: false,
      problems: [],
    }

    this.attemptJoin = this.attemptJoin.bind(this);
  }

  componentWillMount() {
    let groupId = parseInt(this.props.match.params.groupId);
    axios.get("/api/groups/" + groupId + "/")
      .then(function (response) {
        this.setState({group: response.data});
      }.bind(this));
  }

  render() {

    if(!this.state.group) {
      return null;
    }

    let memberGoal = Math.pow(10, (this.state.group.member_count % 10) + 1);

    return (
      <div style={{height: '100%'}}>
        <Paper zDepth={1} style={{padding: '10px 20px', width: '100%', marginLeft: 'auto', marginRight: 'auto'}}>
          <h1>Join us</h1>
          <p style={{fontSize: '12px', margin: '5px 0'}}><span style={{color: cyan600}}>{this.state.group.member_count.toLocaleString()}</span> members</p>
          <LinearProgress mode="determinate" max={memberGoal} value={this.state.group.member_count} color={ cyan600 } style={{backgroundColor: grey100, height: '8px'}} />
          <p style={{fontSize: '12px', textAlign: 'right', margin: '5px 0'}}><span style={{color: cyan600}}>{(memberGoal - this.state.group.member_count).toLocaleString()}</span> needed to reach <span style={{color: cyan600}}>{memberGoal.toLocaleString()}</span></p>
          <TextField
            floatingLabelText="Email address"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateText('txtEmail', newValue)}
            />
          <TextField
            floatingLabelText="First name"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateText('txtFirstName', newValue)}
            />
          <TextField
            floatingLabelText="Last name"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateText('txtLastName', newValue)}
            />
          <TextField
            floatingLabelText="Postcode"
            style={{width: '100%'}}
            floatingLabelFocusStyle={styles.floatingLabelText}
            onChange={(e, newValue) => this.updateText('txtPostcode', newValue)}
            />

          <MessengerCheckboxPlugin
            appId={String(window.authSettings.facebookId)}
            pageId={String(window.authSettings.facebookPageId)}
            />
          <Checkbox checked={this.state.agreedTerms} onCheck={() => this.setState({agreedTerms: !this.state.agreedTerms})} style={{float: 'left', width: '24px', color: cyan600}}/><p style={{margin: '0', fontSize: '14px'}}>By joining you agree to the <a href="https://represent.me/legal/terms/">terms and conditions</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a></p>

          {this.state.problems.map((problem, index) => {
            return (
              <p key={index} style={{color: 'red', margin: '0', marginTop: '5px', fontSize: '14px'}}>{problem}</p>
            );
          })}

          <FlatButton onClick={this.attemptJoin} disabled={!this.state.agreedTerms} label="Join" style={{width: '100%', marginTop: '10px'}} backgroundColor={grey100} secondary />

        </Paper>

        <Dialog
          open={this.state.emailExists}
          >
          <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to join this group."}</p>
          <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={() => this.props.history.push("/login/" + encodeURIComponent(window.location.pathname.substring(1)))} />
        </Dialog>
      </div>
    )
  }

  updateText(field, newValue) {

    if(field === 'txtFirstName' && newValue.length === 1) { // User has completed entering email
      this.checkEmail();
    }

    let newState = {};
    newState[field] = newValue;
    this.setState(newState);
  }

  checkEmail() {

    axios.get('/auth/check_email/?email=' + this.state.txtEmail)
      .then(function (response) {
        if(response.data.result === true) {
          this.setState({emailExists: true});
        }
      }.bind(this));

  }

  attemptJoin() {

    let problems = [];

    if(!RegExp("[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").test(this.state.txtEmail)) {
      problems.push("Email address invalid");
    }

    if(this.state.txtFirstName.length < 2) {
      problems.push("First name invalid");
    }

    if(this.state.txtLastName.length < 2) {
      problems.push("Last name invalid");
    }

    if(this.state.txtPostcode.length < 2 || this.state.txtPostcode.length > 8) {
      problems.push("Postcode invalid");
    }

    if(problems.length === 0) {
      this.setState({problems});
    }else {
      axios.post("/auth/register/", {
        email: this.state.txtEmail,
        first_name: this.state.txtFirstName,
        last_name: this.state.txtLastName,
        address: this.state.txtPostcode
      }).then(function(response) {
      }).catch(function(response) {
        console.log(response.response.data);
        this.setState({problems: [JSON.stringify(response.response.data)]})
      }.bind(this))
    }

  }

}
