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
import CompleteProfile from './CompleteProfile';
import Paper from 'material-ui/Paper';

//let QuestionFlow = inject("CollectionStore", "QuestionStore", "UserStore")(observer(({ history, UserStore, CollectionStore, QuestionStore, match }) => {

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class QuestionFlow extends Component {

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
      history.push('/survey/' + collectionId + '/end');
      return null;
    }

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'scroll' }}>

        {(QuestionStore.questions.get(item.object_id).my_vote.length > 0) && <Paper style={{textAlign: 'center', padding: '5px 0', backgroundColor: cyan600, color: white, position: 'absolute', width: '100%'}} zDepth={1}>{"You answered this in " + monthNames[new Date(QuestionStore.questions.get(item.object_id).my_vote[0].modified_at).getMonth()] + ". Have you changed your mind?"}</Paper>}

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
                  history.push('/survey/' + collectionId + '/flow/' + (orderNumber + 1));
                }else {
                  history.push('/survey/' + collectionId + '/end');
                }
              }} />

            }

            {item.type === "B" && // If rendering a break
              <RenderedBreak break={item.content_object} onContinue={() => {
                if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
                  history.push('/survey/' + collectionId + '/flow/' + (orderNumber + 1));
                }else {
                  history.push('/survey/' + collectionId + '/end');
                }
              }} />
            }

          </ReactCSSTransitionGroup>
        </div>

        <ProgressIndicator key={"PROGRESS_SLIDER"} order={orderNumber} max={collectionItems.length} style={{ position: 'fixed', bottom: '25px', width: '100%', left: '0', padding: '20px 20px 10px 20px', boxSizing: 'border-box', background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%)", height: '70px', zIndex: 5, pointerEvents: "none"}} onChange={(event, value) => {
          if( value < collectionItems.length ) { // If there is a next question
            history.push('/survey/' + collectionId + '/flow/' + value);
          }else {
            history.push('/survey/' + collectionId + '/end');
          }
        }}/>

        <CompleteProfile />

      </div>
    );

  }

  componentDidMount() {
    questionTextFix(this.props.match.params.orderNumber);
  }

  componentDidUpdate() {
    questionTextFix(this.props.match.params.orderNumber);
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
          <h1 style={{maxWidth: '400px', margin: '60px auto 30px auto'}} className={"questionTextFix" + props.order}>{ props.question.question }</h1>

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
        return (<RaisedButton primary={!(props.question.my_vote[0] && props.question.my_vote[0].object_id === choice.id)} key={index} label={choice.text} style={{display:'block', margin: '10px auto', maxWidth: '600px', height: '25px'}} overlayStyle={{height: 'auto'}} onClick={() => props.onUpdate(choice.id)}/>);
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
