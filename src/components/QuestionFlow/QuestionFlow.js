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

let QuestionFlow = inject("CollectionStore", "QuestionStore", "UserStore")(observer(({ history, UserStore, CollectionStore, QuestionStore, match }) => {

  let collectionId = parseInt(match.params.collectionId);
  let orderNumber = parseInt(match.params.orderNumber);
  let collection = CollectionStore.collections.get(collectionId);

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
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactCSSTransitionGroup
        transitionName="FlowTransition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>

        {item.type === "Q" && // If rendering a question

          <RenderedQuestion key={ orderNumber } question={ QuestionStore.questions.get(item.object_id) } onUpdate={(i) => {

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

      <ProgressIndicator key={"PROGRESS_SLIDER"} order={orderNumber} max={collectionItems.length} style={{ position: 'absolute', bottom: '0', width: '100%', left: '0', padding: '20px 20px 10px 20px', boxSizing: 'border-box', background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%)", zIndex: 5, pointerEvents: "none"}} onChange={(event, value) => {
        if( value < collectionItems.length ) { // If there is a next question
          history.push('/collection/' + collectionId + '/flow/' + value);
        }else {
          history.push('/collection/' + collectionId + '/end');
        }
      }}/>

    </div>
  );

}))

let RenderedBreak = (props) => {
  return(
    <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
      <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0px 20px 70px 20px' }}>
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
        <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0 20px 70px 20px' }}>
          <h1>{ props.question.question }</h1>

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
  return (<div style={{overflow: 'hidden', display: 'table', margin: '0 auto'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

let MCQButtons = (props) => {

  return (
    <div>
      { props.question.choices.map((choice, index) => {
        return (<RaisedButton primary={!(props.question.my_vote[0] && props.question.my_vote[0].object_id === choice.id)} key={index} label={choice.text} style={{display:'block', margin: '10px 0'}} onClick={() => props.onUpdate(choice.id)}/>);
      })}
    </div>
  )

}

export default QuestionFlow;
