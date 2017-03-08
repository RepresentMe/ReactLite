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
    CollectionStore.getCollection(collectionId);
    return null;
  }

  let collectionItems = CollectionStore.items(collectionId); // Question data is stored in QuestionStore, not on collectionItems records

  if(!collectionItems || collectionItems.length === 0) {
    return null;
  }

  let item = collectionItems[orderNumber];

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactCSSTransitionGroup
        transitionName="QuestionFlowTransition"
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}>

        {item.type === "Q" && // If rendering a question

          <RenderedQuestion key={ orderNumber } question={ QuestionStore.questions.get(item.object_id) } onUpdate={(i) => {
            if(!UserStore.userData.has("id")) { push("/login"); return } // User must log in

            QuestionStore.voteQuestion(item.object_id, i);
            if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
              push('/collection/' + collectionId + '/flow/' + (orderNumber + 1));
            }else {
              push('/collection/' + collectionId + '/end');
            }
          }} />

        }

        {item.type === "B" && // If rendering a break
          <RenderedBreak break={item.content_object} onContinue={() => {
            if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
              push('/collection/' + collectionId + '/flow/' + (orderNumber + 1));
            }else {
              push('/collection/' + collectionId + '/end');
            }
          }} />
        }

      </ReactCSSTransitionGroup>
    </div>
  );

}))

let RenderedBreak = (props) => {
  return(
    <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
      <div className="QuestionFlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0 20px 40px 20px' }}>
        <h1>{ props.break.title }</h1>
        <h3>{ props.break.text }</h3>
        <RaisedButton label="Continue" onClick={props.onContinue} primary />
      </div>
    </div>  )
}

let RenderedQuestion = (props) => {

  console.log(props);

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
