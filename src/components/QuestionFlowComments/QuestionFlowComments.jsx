import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import AddComment from '../AddComment';
import Comment from '../Comment';
import './style.css';
// import postButtonsStyle from './postButton.js'

@inject("QuestionCommentsStore")
@observer
class QuestionFlowComments extends Component {
  questionId =  824//this.props.question.id

  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: {
        isOpen: false,
        curComment: null
      }
    }
  }

  componentWillMount(nextProps) {
    if(!this.props.QuestionCommentsStore.questionToComments[this.questionId]) {
      this.props.QuestionCommentsStore.getComments(this.questionId)
    } 
  }

  showCommentDeleteDialog = (comment) => {
    this.setState({
      deleteDialog: {
        isOpen: true,
        curComment: comment
      }
    })
  }

  closeCommentDeleteDialog = (buttonClicked) => {
    this.setState({
      deleteDialog: {
        isOpen: false,
        curComment: null
      }
    })
  }

  submitCommentDeleteDialog = () => {
    this.props.QuestionCommentsStore.deleteComment(this.state.deleteDialog.curComment).then((res)=> {
      this.closeCommentDeleteDialog(true);
    })
  }

  render() {
    return (<div className="comments-wrapper">
      <div className="comments-list">
        {this.props.QuestionCommentsStore.questionToComments[this.questionId].comments.map((comment, i) => {
          
          return <Comment key={i} comment={comment} question={this.props.question} onDelete={this.showCommentDeleteDialog.bind(this, comment)} />
        })}
        <ConfirmDeleteCommentDialog isOpen={this.state.deleteDialog.isOpen} handleCancle={this.closeCommentDeleteDialog} handleSubmit={this.submitCommentDeleteDialog} />
      </div>
      
      <AddComment {...this.props}/>
    </div>);
  }
}

class ConfirmDeleteCommentDialog extends Component {
  actions = [
    <FlatButton
      label="Cancel"
      primary={true}
      onTouchTap={this.props.handleCancle}
    />,
    <FlatButton
      label="Delete"
      primary={true}
      keyboardFocused={true}
      onTouchTap={this.props.handleSubmit}
    />,
  ]
  render() {
    const {isOpen, handleCancle} = this.props;
    return (
      <Dialog
        title="Deleting comment"
        actions={this.actions}
        modal={false}
        open={isOpen}
        onRequestClose={handleCancle}
      >
        Do you want to delete comment?
      </Dialog>
    )
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