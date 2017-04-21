import React, { Component } from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import Dialog from 'material-ui/Dialog';

import logo from './represent_white_outline.svg';

@inject("UserStore") @observer class CandidateIntro extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      checking: false,
      showEmailExistsDialog: false,
      emailInvalid: false,
    }
    this.checkEmail = this.checkEmail.bind(this)
  }

  render() {
    return (
      <div style={{ display: 'table', width: '100%', height: '100%' }}>
        <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%' }}>
          <div style={{ width: '300px', display: 'inline-block' }}>
            <img src={logo} style={{width: '100px'}} /><br/>
            <TextField
              hintText="Email"
              type="email"
              fullWidth={true}
              value={this.state.email}
              onChange={(event) => this.setState({email: event.target.value})}
              />
            <RaisedButton label="Begin" fullWidth={true} onClick={this.checkEmail} disabled={this.state.checking} />
          </div>
        </div>

        <Dialog open={this.state.showEmailExistsDialog} contentStyle={{width: '300px'}}>
          <div>
            <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to continue."}</p>
            <RaisedButton label="Login" style={{width: '100%'}} onClick={() => {
              this.props.history.push("/login/" + encodeURIComponent(window.location.pathname.substring(1)) + "/" + encodeURIComponent(this.state.email))
            }} />
          </div>
        </Dialog>

        <Dialog open={this.state.emailInvalid} contentStyle={{width: '300px'}}>
          <div>
            <p style={{fontWeight: 'bold'}}>{"You've entered an invalid email address, please check it and try again."}</p>
            <RaisedButton label="Continue" style={{width: '100%'}} onClick={() => this.setState({emailInvalid: false})} />
          </div>
        </Dialog>

      </div>
    )
  }

  checkEmail() {
    this.setState({checking: true})

    if(!this.props.UserStore.checkEmailRegex(this.state.email)) {
      this.setState({emailInvalid: true, checking: false})
      return
    }

    this.props.UserStore.checkEmail(this.state.email)
      .then((exists) => {
        if(exists) {
          this.setState({checking: false, showEmailExistsDialog: true})
        }else {
          this.setState({checking: false})
          this.props.history.push('/candidate/new/' + encodeURIComponent(this.state.email))
        }
      })
  }
}

export default CandidateIntro
