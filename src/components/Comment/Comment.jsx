import React, { Component } from 'react';
import { observer, inject } from "mobx-react";



import './style.css';

@inject("UserStore", "QuestionCommentsStore")
@observer
class Comment extends Component {

constructor(props) {

    super(props)
    // this.state = {
    //  comment: ''
    // }
    // this.onSend = this.onSend.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  confirmDelete() {
    
  }

  deleteComment = () => {
    this.props.QuestionCommentsStore.deleteComment(this.props.comment);
  }

  render() {
    const { comment, UserStore, onDelete } = this.props
    return (
      <div className="comment">
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
            {UserStore.isLoggedIn() && UserStore.userData.get("id") == comment.user.id && (<div>
              <span className="dot"> · </span>
              <a className="change-answer" onClick={onDelete} >Delete</a>
            </div>)}
            <span className="dot"> · </span>
            <span className="date">10 Sep</span>
            <span className="dot"> · </span>
            <a className="report">Report</a>
          </div>
        </div>
      </div>
    );
  }
}


export default Comment;