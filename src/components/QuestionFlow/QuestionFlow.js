import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import Tappable from 'react-tappable';
import './QuestionFlow.css';

let QuestionFlow = inject("CollectionStore", "QuestionStore", "UserStore")(observer(({ push, UserStore, CollectionStore, QuestionStore, match }) => {

  let collectionId = parseInt(match.params.collectionId);
  let orderNumber = parseInt(match.params.orderNumber);
  let collection = CollectionStore.collections.get(collectionId);

  if(!collection) {
    return null;
  }

  if(!QuestionStore.collectionQuestions.has(collectionId)) {
    // Buffer the questions
    QuestionStore.loadCollectionQuestions(collectionId);
    return null;
  }

  let questions = [];

  for (let questionId of QuestionStore.collectionQuestions.get(collectionId)) {
    questions.push(QuestionStore.questions.get(questionId));
  }

  if(!questions[orderNumber]) {
    return null;
  }

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactCSSTransitionGroup
        transitionName="QuestionFlowTransition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>
        <RenderedQuestion key={ orderNumber } question={ questions[orderNumber] } onUpdate={(i) => {

          if(!UserStore.userData.has("id")) {
            push("/login");
            return
          }

          QuestionStore.voteQuestion(questions[orderNumber].id, i);
          if( orderNumber < questions.length - 1 ) { // If there is a next question
            push('/collection/' + collectionId + '/flow/' + (orderNumber + 1));
          }else {
            push('/collection/' + collectionId + '/end');
          }
        }} />
      </ReactCSSTransitionGroup>
    </div>
  );

}))

let RenderedQuestion = (props) => {

  let myVote = null;

  if(props.question.my_vote.length > 0) {
    myVote = props.question.my_vote[0].value;
  }

  return (
      <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
        <div className="QuestionFlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0 20px 40px 20px' }}>
          <h1>{ props.question.question }</h1>
          <LikertButtons onUpdate={(i) => props.onUpdate(i)} value={myVote} />
        </div>
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

export default QuestionFlow;
