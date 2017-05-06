import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import RaisedButton from 'material-ui/RaisedButton';
import AddComment from '../AddComment';
import Comment from '../Comment';
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
        {this.props.QuestionCommentsStore.questionToComments[this.questionId].comments.map((comment, i) => {
          
          return <Comment key={i} comment={comment} store={this.props.QuestionCommentsStore} />
        })}
      </div>
      
      <AddComment {...this.props}/>
    </div>);
  }
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