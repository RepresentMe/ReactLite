import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import TextField from 'material-ui/TextField';

import './style.css';

@inject("UserStore", "QuestionCommentsStore")
@observer
class Comment extends Component {

constructor(props) {

  super(props)
    this.state = {
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      }
    }
  }

  handleSharePopoverOpen = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    const {currentTarget} = event;
    this.setState({
      sharePopover: {
        isOpen: true,
        curAnchorEl: currentTarget
      }
    })
  }

  handleSharePopoverClose = () => {
    this.setState({
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      }
    });
  };

  render() {
    const { comment, UserStore, onDelete, onReport } = this.props;
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
            <a className="change-answer">Change my answer</a>
            <span className="dot"> · </span>
            <span className="date">10 Sep</span>
            <span className="dot"> · </span>
            <a className="report" onClick={onReport} >Report</a>
            {UserStore.isLoggedIn() && UserStore.userData.get("id") == comment.user.id && (<span>
              <span className="dot"> · </span>
              <a className="change-answer" onClick={onDelete} >Delete</a>
            </span>)}
            <span className="dot"> · </span>
            <a className="share" onClick={this.handleSharePopoverOpen}>Share</a>

            <Popover
              open={this.state.sharePopover.isOpen}
              anchorEl={this.state.sharePopover.curAnchorEl}
              onRequestClose={this.handleSharePopoverClose}
            >
              <Menu>
                <MenuItem primaryText="Share in FB" />
                <MenuItem primaryText="Share in Twitter" />
              </Menu>
            </Popover>

          </div>
        </div>
      </div>
    );
  }
}

export default Comment;