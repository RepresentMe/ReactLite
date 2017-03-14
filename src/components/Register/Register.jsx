import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TextField from 'material-ui/TextField';
import { cyan600 } from 'material-ui/styles/colors';
import MuiGeoSuggest from 'material-ui-geosuggest';
import DatePicker from 'material-ui/DatePicker';

@inject("QuestionStore", "CollectionStore", "UserStore") @observer class Register extends Component {

  constructor() {

    super();
    this.state = {
      showIntroDialog: true,
      currentValue: 0,
      formValues: [
        {
          type: 'date',
          name: 'Date of birth',
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
          type: 'email',
          name: 'Email',
          value: '',
        },
        {
          type: 'location',
          name: 'Location',
          value: '',
        },
      ]
    }

    this.nextField = this.nextField.bind(this);
    this.previousField = this.previousField.bind(this);
    this.attemptRegistration = this.attemptRegistration.bind(this);
  }

  render() {

    let formElement = this.state.formValues[this.state.currentValue];

    return(
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>


        <ReactCSSTransitionGroup
          transitionName="FlowTransition"
          transitionEnterTimeout={1000}
          transitionLeaveTimeout={1000}>

          <FormItemContainer key={formElement.name}>

            {(formElement.type === 'text' || formElement.type === 'email') &&
              <FormTextField text={formElement.name} value={formElement.value} autoFocus={autoFocus => autoFocus && autoFocus.focus()} onChange={(e) => {

                if(/\r|\n/.exec(e.target.value)) {
                  this.setState({currentValue: this.state.currentValue + 1});
                  return;
                }

                let newText = e.target.value;
                let newFormValues = this.state.formValues.slice(0);
                formElement.value = newText
                newFormValues.splice(this.state.currentValue, 1, formElement);
                this.setState({formValues: newFormValues});
              }} />
            }

            {formElement.type === 'location' &&
              <MuiGeoSuggest
                style={{width: '100%', fontSize: '28px'}}
                onPlaceChange={(e) => {
                  let newFormValues = this.state.formValues.slice(0);
                  formElement.value = e.formatted_address
                  newFormValues.splice(this.state.currentValue, 1, formElement);
                  this.setState({formValues: newFormValues});
                  this.nextField();
                }}
                hintText={formElement.name}
                underlineShow={false}
                multiLine={true}
                defaultValue={formElement.value}
                />
            }

            {formElement.type === 'date' &&

              <DatePicker hintText={formElement.name} mode="landscape" />

            }


          </FormItemContainer>

        </ReactCSSTransitionGroup>

        <div style={{position: 'absolute', bottom: '10px', width: '100%'}}>
          <div style={{width: '320px', margin: '0 auto'}}>
            <FlatButton label="Back" style={{float: 'left'}} onClick={() => this.previousField()} />
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
              {this.props.match.params.redirect && <FlatButton label="Cancel" onClick={() => this.props.push("/" + decodeURIComponent(this.props.match.params.redirect))}/>}
            </div>
          }
          >
            {"Represent makes it easy to vote, debate, and delegate decisions, making democracy effective every single day."}<br/><br/>
            {"Content on the Represent platform comes from a variety of curuated, 3rd party and user generated sources. To get the most out of Represent we recommend visiting"} <a href="https://represent.me">represent.me</a> and subscribing to the movements, unions, charities and groups you support.<br/><br/>
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
      }
    }
    console.log(problems);
  }

}

let FormTextField = (props) => (
  <TextField
    hintText={props.text}
    style={{width: '100%', fontSize: '28px'}}
    underlineShow={false}
    ref={props.autoFocus}
    multiLine={true}
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

export default Register;
