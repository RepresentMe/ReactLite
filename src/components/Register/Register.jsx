import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TextField from 'material-ui/TextField';
import { cyan600, orange500 } from 'material-ui/styles/colors';
import MuiGeoSuggest from 'material-ui-geosuggest';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

@inject("QuestionStore", "CollectionStore", "UserStore") @observer class Register extends Component {

  constructor() {

    let now = new Date();
    let startDOB = new Date();
    startDOB.setFullYear(now.getFullYear() - 13);

    super();
    this.state = {
      showIntroDialog: false,
      showErrorDialog: false,
      registrationErrors: [],
      currentValue: 0,
      formValues: [
        {
          type: 'email',
          name: 'Email',
          value: '',
        },
        {
          type: 'text',
          name: 'First name',
          value: '',
        },
        {
          type: 'text',
          name: 'Last name',
          value: '',
        },
        {
          type: 'dob',
          name: 'Date of birth',
          value: startDOB.toISOString(),
        },
        {
          type: 'postcode',
          name: 'Postcode',
          value: '',
        },
        {
          type: 'password',
          name: 'Password',
          value: '',
        },
      ]
    }

    this.nextField = this.nextField.bind(this);
    this.previousField = this.previousField.bind(this);
    this.attemptRegistration = this.attemptRegistration.bind(this);
    this.getCurrentFormElement = this.getCurrentFormElement.bind(this);
    this.fieldUpdate = this.fieldUpdate.bind(this);
  }

  fieldUpdate(newValue) {
    let formElement = this.getCurrentFormElement();
    let newFormValues = this.state.formValues.slice(0);
    formElement.value = newValue
    newFormValues.splice(this.state.currentValue, 1, formElement);
    this.setState({formValues: newFormValues});
  }

  getCurrentFormElement() {
    return this.state.formValues[this.state.currentValue];
  }

  render() {

    let formElement = this.getCurrentFormElement();
    let maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() - 13);

    return(
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>


        <ReactCSSTransitionGroup
          transitionName="FlowTransition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}>

          <FormItemContainer key={formElement.name}>

            {(formElement.type === 'text' || formElement.type === 'email' || formElement.type === 'password') &&
              <FormTextField type={formElement.type} hintText={formElement.name} onFieldUpdate={this.fieldUpdate} value={formElement.value} />
            }

            {formElement.type === 'postcode' &&
              <FormTextField hintText={formElement.name} onFieldUpdate={this.fieldUpdate} value={formElement.value} />
            }

            {formElement.type === 'dob' &&
              <DOBPicker name={formElement.name} value={formElement.value} onChange={this.fieldUpdate} />
            }

          </FormItemContainer>

        </ReactCSSTransitionGroup>

        <div style={{position: 'absolute', bottom: '10px', width: '100%'}}>
          <div style={{width: '320px', margin: '0 auto'}}>
            <FlatButton label="Back" style={{float: 'left'}} onClick={() => this.previousField()} disabled={this.state.currentValue === 0} />
            <FlatButton label="Next" primary style={{float: 'right'}} onClick={() => this.nextField()} />
          </div>
        </div>

        <Dialog
          title="Welcome to Represent"
          modal={false}
          open={this.state.showIntroDialog}
          actions={
            <div>
              <FlatButton primary label="Register" onClick={() => this.setState({showIntroDialog: false})} />
              {this.props.match.params.redirect && <FlatButton label="Cancel" onClick={() => this.props.history.push("/" + decodeURIComponent(this.props.match.params.redirect))}/>}
            </div>
          }
          >
            {"Represent makes it easy to vote, debate, and delegate decisions, making democracy effective every single day."}<br/><br/>
            {"Content on the Represent platform comes from a variety of curuated, 3rd party and user generated sources. To get the most out of Represent we recommend visiting"} <a href="https://represent.me">represent.me</a> and subscribing to the movements, unions, charities and groups you support.<br/><br/>
          </Dialog>

          <Dialog
            title="Registration Errors"
            modal={false}
            open={this.state.showErrorDialog}
            actions={
              <div>
                <FlatButton primary label="Close" onClick={() => this.setState({showErrorDialog: false})} />
              </div>
            }
            >
              {this.state.registrationErrors.map((error, index) => {
                return <div key={index} style={{color: orange500, marginTop: '10px'}}>{error}</div>
              })}
            </Dialog>
      </div>
    );
  }

  nextField() {
    if(this.state.currentValue < this.state.formValues.length - 1) {
      this.setState({currentValue: this.state.currentValue + 1})
    }else {
      this.attemptRegistration();
    }
  }

  previousField() {
    if(this.state.currentValue > 0) {
      this.setState({currentValue: this.state.currentValue - 1})
    }
  }

  attemptRegistration() {
    let problems = [];

    for(let field of this.state.formValues) {
      if(field.type === 'email' && !RegExp("[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").test(field.value)) { // Validate email address
        problems.push(field.name + " is invalid");
      }else if((field.type === 'text' || field.type === 'location') && field.value.length === 0) {
        problems.push(field.name + " cannot be blank");
      }else if(field.type === 'password' && field.value.length < 8) {
        problems.push(field.name + " must be at least 8 characters long");
      }
    }

    if(problems.length > 0) {
      this.setState({
        registrationErrors: problems,
        showErrorDialog: true
      });
    }else {
      this.props.UserStore.register().then((response) => {
        }).catch((response) => {
        this.setState({
          registrationErrors: ["Server returned error on registration: " + response],
          showErrorDialog: true
        });
      });
    }
  }

}

const styles = {
  formTextField: {
    width: '100%',
    fontSize: '28px',
  }
}

let FormTextField = (props) => (
  <TextField
    hintText={props.hintText}
    style={styles.formTextField}
    underlineShow={false}
    onChange={(e) => props.onFieldUpdate(e.target.value)}
    value={props.value}
    type={props.type}
  />
)

FormTextField.defaultProps = {
  hintText: React.PropTypes.string.isRequired,
  stateField: React.PropTypes.string.isRequired,
  value: React.PropTypes.string.isRequired,
  autoFocus: true,
  type: 'text',
}

let FormPasswordField = (props) => (
  <TextField
    type="password"
    hintText={props.text}
    style={{width: '100%', fontSize: '28px'}}
    underlineShow={false}
    ref={props.autoFocus}
    onChange={(e) => props.onChange(e)}
    value={props.value}
  />
)

let FormItemContainer = (props) => {
  return (
    <div style={{ display: 'table', width: '320px', height: '100%', position: 'absolute', marginLeft: 'calc(50% - 160px)' }}>
      <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0px 0 20px 0' }}>
        {props.children}
      </div>
    </div>
  )
}

let DOBPicker = (props) => {
  let days = [];
  for(let i = 1; i < 32; i++) {
    days.push(i);
  }

  var months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

  let thisYear = new Date().getFullYear();
  let years = [];
  for(let i = 13; i < 113; i++) {
    years.push(thisYear - i);
  }

  let selectedDate = new Date(props.value);

  return (
    <div style={{textAlign: 'center'}}>

      <h3 style={{width: '100%'}}>{props.name}</h3>

      <DropDownMenu value={selectedDate.getDate()} onChange={(e, index, value) => {
        selectedDate.setDate(value);
        props.onChange(selectedDate.toISOString());
      }} maxHeight={200}>
        {days.map((value, index) => {
          return <MenuItem value={value} primaryText={value} key={index} />
        })}
      </DropDownMenu>

      <DropDownMenu value={selectedDate.getMonth()} maxHeight={200} onChange={(e, index, value) => {
        selectedDate.setMonth(value);
        props.onChange(selectedDate.toISOString());
      }}>
        {months.map((value, index) => {
          return <MenuItem value={index + 1} primaryText={value} key={index} label={value.substring(0, 3)} />
        })}
      </DropDownMenu>

      <DropDownMenu value={selectedDate.getFullYear()} maxHeight={200} onChange={(e, index, value) => {
        selectedDate.setFullYear(value);
        props.onChange(selectedDate.toISOString());
      }}>
        {years.map((value, index) => {
          return <MenuItem value={value} primaryText={value} key={index} />
        })}
      </DropDownMenu>

    </div>
  )
}

export default Register;
