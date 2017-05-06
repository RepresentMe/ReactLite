import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import RaisedButton from 'material-ui/RaisedButton';
import AddComment from '../AddComment';
import './style.css';
// import postButtonsStyle from './postButton.js'

var comments = [];
for (var i = 0; i < 10; i++) {
  comments.push({text: i});  
}
@inject("QuestionCommentsStore")
@observer
class QuestionFlowComments extends Component {
  questionId =  824//this.props.question.id
  componentWillMount(nextProps) {
    if(!this.props.QuestionCommentsStore.questionToComments[this.questionId]) {
      this.props.QuestionCommentsStore.getComments(this.questionId)
    } 
  }

  render() {
    return (<div className="comments-wrapper">
      <div className="comments-list">
        {this.props.QuestionCommentsStore.questionToComments[this.questionId].comments.map((comment) => {
          
          return <Comment comment={comment} />
        })}
      </div>
      
      <AddComment {...this.props}/>
    </div>);
  }
}

const Comment = ({comment}) => {
  return (<div className="comment">
    {/*<Votes />*/}
    <div className="content">
      <div className="comment-data">
        <a className="author">
          <img src={comment.user.photo} />
          <span className="name">{comment.user.first_name} {comment.user.last_name}</span>
        </a>
        <div className="pull-right">
          <span className="type text-xs">info</span>
          <span className="author-answer text-xs s-agree">Strongly disagree</span>
        </div>
        <div className="comment-text">
          <p>{comment.text}</p>
        </div>
      </div>
      <div className="buttons">
        <a className="reply">Reply</a>
        <span className="dot"> · </span>
        <a className="share">Share</a>
        <span className="dot"> · </span>
        <a className="change-answer">Change my answer</a>
        <span className="dot"> · </span>
        <span className="date">10 Sep</span>
        <span className="dot"> · </span>
        <a className="report">Report</a>
      </div>
    </div>
  </div>)
}

const Votes = () => {
  return (<div className="votes">
    <span className="up-vote">
      <i className="fa fa-chevron-up"></i>
    </span>
    <span className="value">0</span>
    <span className="down-vote">
      <i className="fa fa-chevron-down"></i>
    </span>
  </div>)
}

export default QuestionFlowComments;