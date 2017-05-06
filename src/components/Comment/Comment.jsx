import React, { Component } from 'react';

import './style.css';

class Comment extends Component {

constructor(props) {

    super(props)
    // this.state = {
    //  comment: ''
    // }
    // this.onSend = this.onSend.bind(this)
    // this.handleChange = this.handleChange.bind(this)
  }

  render() {
    const { comment } = this.props
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