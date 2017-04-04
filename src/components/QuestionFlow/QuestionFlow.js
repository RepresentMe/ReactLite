import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import Tappable from 'react-tappable';
import './QuestionFlow.css';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import { white, cyan600, grey300 } from 'material-ui/styles/colors';
import ReactMarkdown from 'react-markdown';
import Dialog from 'material-ui/Dialog';
import $ from 'jquery';
import DateOfBirth from "../DateOfBirth";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import GeoService from '../../services/GeoService';


//let QuestionFlow = inject("CollectionStore", "QuestionStore", "UserStore")(observer(({ history, UserStore, CollectionStore, QuestionStore, match }) => {

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class QuestionFlow extends Component {

  constructor() {
    super();
    this.state = {
      completeProfileDialog: false,
      shownCompleteProfileDialog: true,
    }

    this.checkProfileComplete = this.checkProfileComplete.bind(this);
  }

  render() {

    let { history, UserStore, CollectionStore, QuestionStore, match } = this.props;

    let collectionId = parseInt(match.params.collectionId);
    let orderNumber = parseInt(match.params.orderNumber);
    let collection = this.props.CollectionStore.collections.get(collectionId);

    if(!collection) {
      CollectionStore.getCollection(collectionId);
      return null;
    }

    let collectionItems = CollectionStore.items(collectionId); // Question data is stored in QuestionStore, not on collectionItems records

    if(collectionItems === null) {
      return null;
    }

    let item = collectionItems[orderNumber];

    if(!item) {
      history.push('/collection/' + collectionId + '/end');
      return null;
    }

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'scroll' }}>
        <div style={{ width: '100%', height: '100%', overflow: 'scroll' }}>
          <ReactCSSTransitionGroup
            transitionName="FlowTransition"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}>

            {item.type === "Q" && // If rendering a question

              <RenderedQuestion order={ orderNumber } key={ orderNumber } question={ QuestionStore.questions.get(item.object_id) } onUpdate={(i) => {

                let question = QuestionStore.questions.get(item.object_id);

                if(!UserStore.userData.has("id")) { history.push("/login/" + encodeURIComponent(window.location.pathname.substring(1))); return } // User must log in

                if(question.subtype === 'likert') {
                  QuestionStore.voteQuestionLikert(item.object_id, i, collectionId);
                }else if(question.subtype === 'mcq') {
                  QuestionStore.voteQuestionMCQ(item.object_id, i, collectionId);
                }

                if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
                  history.push('/collection/' + collectionId + '/flow/' + (orderNumber + 1));
                }else {
                  history.push('/collection/' + collectionId + '/end');
                }
              }} />

            }

            {item.type === "B" && // If rendering a break
              <RenderedBreak break={item.content_object} onContinue={() => {
                if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
                  history.push('/collection/' + collectionId + '/flow/' + (orderNumber + 1));
                }else {
                  history.push('/collection/' + collectionId + '/end');
                }
              }} />
            }

          </ReactCSSTransitionGroup>
        </div>

        <ProgressIndicator key={"PROGRESS_SLIDER"} order={orderNumber} max={collectionItems.length} style={{ position: 'fixed', bottom: '20px', width: '100%', left: '0', padding: '20px 20px 10px 20px', boxSizing: 'border-box', background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%)", height: '70px', zIndex: 5, pointerEvents: "none"}} onChange={(event, value) => {
          if( value < collectionItems.length ) { // If there is a next question
            history.push('/collection/' + collectionId + '/flow/' + value);
          }else {
            history.push('/collection/' + collectionId + '/end');
          }
        }}/>

        <Dialog
          title="Please complete your profile"
          open={this.state.completeProfileDialog}>
          <CompleteProfile />
        </Dialog>

      </div>
    );

  }

  componentDidMount() {
    questionTextFix(this.props.match.params.orderNumber);
    this.checkProfileComplete();
  }

  componentDidUpdate() {
    questionTextFix(this.props.match.params.orderNumber);
    this.checkProfileComplete();
  }

  checkProfileComplete() {
    if(this.props.UserStore.userData.has("id") && !this.state.shownCompleteProfileDialog) {
      let profile = this.props.UserStore.userData.toJS();
      console.log(profile);
      if(!profile.dob || !profile.address || profile.gender === 0) {
        this.setState({completeProfileDialog: true, shownCompleteProfileDialog: true})
      }
    }
  }

}

@inject("UserStore") @observer class CompleteProfile extends Component {

  constructor() {
    super();

    // this.state = {
    //   ddDOB: UserStore.userData.get("dob"),
    //   ddGender: UserStore.userData.get("gender"),
    //   txtPostcode: UserStore.userData.get("address"),
    // }

    this.state = {
      ddDOB: null,
      ddGender: null,
      txtPostcode: "",
    }

    this.updateDetails = this.updateDetails.bind(this);
  }

  componentWillMount() {
    let {UserStore} = this.props;

    this.state = {
      ddDOB: UserStore.userData.get("dob") || null,
      ddGender: UserStore.userData.get("gender") || null,
      txtPostcode: UserStore.userData.get("address"),
      problems: [],
    }
  }

  updateField(field, newValue) {

    if((field === 'txtPostcode' || field === 'txtFirstName') && newValue.length === 1) { // User has completed entering email
      this.checkEmail();
    }

    let newState = {};
    newState[field] = newValue;
    this.setState(newState);
  }

  render() {

    let {UserStore} = this.props;

    return (
      <div>
        <p>{"Hey, we've noticed your profile is incomplete. Completing your profile helps your decision makers take us more seriously, please take a moment to review and complete the data missing from your profile:"}</p>
        {!UserStore.userData.get("dob") && <DateOfBirth onChange={(newValue) => this.updateField('ddDOB', newValue)} value={this.state.ddDOB}/>}

        {UserStore.userData.get("gender") === 0 &&
          <SelectField
            floatingLabelText="Gender"
            value={this.state.ddGender}
            style={{width: '100%', marginTop: '-15px', overflow: 'hidden'}}
            onChange={(e, newIndex, newValue) => this.updateField('ddGender', newValue)}
          >
            <MenuItem value={1} primaryText="Male" />
            <MenuItem value={2} primaryText="Female" />
            <MenuItem value={3} primaryText="Other" />
            <MenuItem value={0} primaryText="I would rather not say" />
          </SelectField>
        }

        {!UserStore.userData.get("address") === "" &&
          <TextField
            floatingLabelText="Postcode"
            style={{width: '100%'}}
            onChange={(e, newValue) => this.updateField('txtPostcode', newValue)}
            />
        }

        {this.state.problems.map((problem, index) => {
          return (
            <p key={index} style={{color: 'red', margin: '0', marginBottom: '5px', fontSize: '14px'}}>{problem}</p>
          );
        })}

        <RaisedButton label="Continue" onClick={this.updateDetails}/>
      </div>
    )
  }

  updateDetails() {

    let problems = [];

    if(this.state.ddDOB === null) {
      problems.push("Please enter a valid date of birth!");
    }

    if(this.state.ddGender === null) {
      problems.push("Please select your gender, or choose 'I would rather not say'");
    }

    if(this.state.txtPostcode.length < 2 || this.state.txtPostcode.length > 8) {
      problems.push("Please enter a valid postcode!");
    }

    if(problems.length !== 0) {
      this.setState({problems});
      return;
    }

    GeoService.checkPostcode(this.state.txtPostcode)
      .then(function(response) {

        let location = null;

        if(response.data.status === "OK") {
          let raw_location = response.data.results[0].geometry.location;
          location =  {
            "type": "Point",
            "coordinates": [raw_location.lng, raw_location.lat]
          };

          window.API.patch("/auth/me/", {
            dob: this.state.ddDOB,
            gender: this.state.ddGender,
            address: this.state.txtPostcode,
            location
          }).then(() => {

          }).catch((error) => {
            this.setState({problems: [JSON.stringify(error.response.data)]})
          });
        }else {
          this.setState({problems: ["Please ensure you've entered a valid postcode"]});
        }

      }.bind(this));
  }

}

let RenderedBreak = (props) => {
  return(
    <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
      <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0px 20px 40px 20px' }}>
        <h1>{ props.break.title }</h1>
        <ReactMarkdown source={ props.break.text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>
        <RaisedButton label="Continue" onClick={props.onContinue} primary />
      </div>
    </div>  )
}

let RenderedQuestion = (props) => {

  let myVote = null;

  if(props.question.my_vote.length > 0) {
    myVote = props.question.my_vote[0].value;
  }

  return (
      <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
        <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 20px 40px 20px' }}>
          <h1 style={{maxWidth: '400px', margin: '10px auto'}} className={"questionTextFix" + props.order}>{ props.question.question }</h1>

          {props.question.subtype === "likert" && <LikertButtons onUpdate={(i) => props.onUpdate(i)} value={myVote} />}
          {props.question.subtype === "mcq" && <MCQButtons onUpdate={(i) => props.onUpdate(i)} question={props.question} />}

        </div>
      </div>
  )
}

let ProgressIndicator = (props) => {

  return (
    <div style={props.style}>
      <p style={{textAlign: 'center', color: cyan600, margin: "5px 0" }}>{props.order + 1} / {props.max}</p>
      <Slider style={{backgroundColor: grey300, width: '100%', pointerEvents: "all"}} sliderStyle={{backgroundColor: white, color: cyan600, margin: "0"}} max={props.max} min={0} value={props.order} step={1} onChange={props.onChange}/>
    </div>
  )
}

let LikertButtons = (props) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div className={ "likertButton likertButton" + i + ( props.value && props.value !== i ? " likertButtonDimmed" : "")} key={i} onClick={() => props.onUpdate(i)}></div>);
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

let MCQButtons = (props) => {

  return (
    <div>
      { props.question.choices.map((choice, index) => {
        return (<RaisedButton primary={!(props.question.my_vote[0] && props.question.my_vote[0].object_id === choice.id)} key={index} label={choice.text} style={{display:'block', margin: '10px auto', maxWidth: '400px'}} onClick={() => props.onUpdate(choice.id)}/>);
      })}
    </div>
  )

}

const questionTextFix = (key = "") => {
  let target = $('.questionTextFix' + key);
  while(target.height() * 100 / $(document).height() > 20) {
    target.css('font-size', (parseInt(target.css('font-size')) - 1) + 'px')
  }
}

export default QuestionFlow;
