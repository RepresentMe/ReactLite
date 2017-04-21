import React, { Component } from 'react'
import { observer, inject } from "mobx-react"
import RaisedButton from 'material-ui/RaisedButton';
import Formsy from 'formsy-react'
import FormsyText from 'formsy-material-ui/lib/FormsyText';
import FormsyDate from 'formsy-material-ui/lib/FormsyDate';

import logo from './represent_white_outline.svg';

@inject("UserStore") @observer class CandidateNew extends Component {

  constructor() {
    super()

    this.state = {
      canSubmitA: false,
    }
  }

  componentWillMount() {
    this.email = decodeURIComponent(this.props.match.params.email)
  }

  render() {
    return (
      <div style={{ display: 'table', width: '100%', height: '100%' }}>
        <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%' }}>
          <div style={{ width: '300px', display: 'inline-block', margin: '20px 0' }}>
            <img src={logo} style={{width: '100px'}} /><br/>
            <Formsy.Form onValidSubmit={this.onSubmitA} onValid={() => this.toggleSubmitA(true)} onInvalid={() => this.toggleSubmitA(false)}>
              <FormsyText
                name="first_name"
                validations="isWords"
                required
                hintText="What is your first name?"
                floatingLabelText="First Name"
                fullWidth={true}
              />
              <FormsyText
                name="last_name"
                validations="isWords"
                required
                hintText="What is your last name?"
                floatingLabelText="Last Name"
                fullWidth={true}
              />
              <FormsyText
                value={this.email}
                name="email"
                validations="isEmail"
                required
                hintText="What is your email address?"
                floatingLabelText="Email Address"
                fullWidth={true}
              />
              <FormsyText
                name="postcode"
                validations="isWords"
                required
                hintText="What is your postcode?"
                floatingLabelText="Postcode"
                fullWidth={true}
              />
              <FormsyDate
                name="date"
                required
                floatingLabelText="Date of Birth"
                fullWidth={true}
              />
              <RaisedButton label="Submit" fullWidth={true} disabled={!this.state.canSubmitA} />
            </Formsy.Form>
          </div>
        </div>
      </div>
    )
  }

  toggleSubmitA(value) {
    this.setState({canSubmitA: value})
  }

  onSubmitA() {

  }
}

export default CandidateNew
