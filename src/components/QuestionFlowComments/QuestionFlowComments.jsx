import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import RaisedButton from 'material-ui/RaisedButton';

import './style.css';
// import postButtonsStyle from './postButton.js'

var comments = [];
for (var i = 0; i < 10; i++) {
  comments.push({text: i});  
}
@inject("QuestionCommentsStore")
@observer
class QuestionFlowComments extends Component {
  // componentWillMount(nextProps) {
  //   this.props.CollectionStore.getComments()
  // }

  render() {
    return (<div className="comments-wrapper">
      <div className="comments-list">
        {this.props.QuestionCommentsStore.comments.map((comment) => {
          return <Comment comment={comment} />
        })}
      </div>
      <div className="add-comment-wrapper">
        <div className="add-comment">
          <button className="add-comment-btn">Send</button>
          {/* TODO <RaisedButton label="Primary" primary={true} />*/}
          <div className="add-comment-area-wrapper" ><textarea className="add-comment-area" /></div>
        </div>
      </div>
    </div>);
  }
}

const Comment = ({comment}) => {
  return (<div className="comment">
    {/*<Votes />*/}
    <div className="content">
      <div className="comment-data">
        <a className="author">
          <img src="https://s3.eu-central-1.amazonaws.com:443/static.represent.me/images/prof_initials_319610416022476c93debfd42bd6b16b.png" />
          <span className="name">Anna Fox</span>
        </a>
        <div className="pull-right">
          <span className="type text-xs">info</span>
          <span className="author-answer text-xs s-agree">Strongly disagree</span>
        </div>
        <div className="comment-text">
          <p>Aside from food waste, customers should routinely remove waste packaging and leave it at the stores rather than perpetuating it's wasteful use.</p>
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