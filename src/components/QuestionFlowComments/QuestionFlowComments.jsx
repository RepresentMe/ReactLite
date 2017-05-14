import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import RaisedButton from 'material-ui/RaisedButton';

import AddComment from './partials/AddComment';
import Comment from './partials/Comment';
import NoComments from './partials/NoComments';
import ConfirmDeleteCommentDialog from './partials/ConfirmDeleteCommentDialog';
import ReportDialog from './partials/ReportDialog';
import './style.css';
// import postButtonsStyle from './postButton.js'

@inject("QuestionCommentsStore")
@observer
class QuestionFlowComments extends Component {
  // questionId =  823//this.props.question.id

  constructor(props) {
    super(props);
    this.state = {
      deleteDialog: {
        isOpen: false,
        curComment: null
      },
      reportDialog: {
        isOpen: false
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

  closeCommentDeleteDialog = () => {
    this.setState({
      deleteDialog: {
        isOpen: false,
        curComment: null
      }
    })
  }

  submitCommentDeleteDialog = () => {
    this.props.QuestionCommentsStore.deleteComment(this.state.deleteDialog.curComment).then((res)=> {
      this.closeCommentDeleteDialog();
    })
  }

  createReport = (text) => {
    this.props.QuestionCommentsStore.createReport(text)
      .then(() => {
        this.handleCloseReportDialog()
      })
  }

  handleOpenReportDialog = () => {
    this.setState({
      reportDialog: {
        isOpen: true
      }
    })
  };

  handleCloseReportDialog = () => {
    this.setState({
      reportDialog: {
        isOpen: false
      }
    });
  };

  render() {
    const { comments } = this.props.QuestionCommentsStore.questionToComments[this.questionId]
    return (<div className="comments-wrapper" style={{ textAlign: '-webkit-center' }}>
      {
        comments.length ? (
          <div className="comments-list" style={{ maxWidth: '600px', textAlign: '-webkit-auto', overflow: 'auto' }}>
            {comments.map((comment, i) => {
              return <Comment key={i} comment={comment} question={this.props.question} onDelete={this.showCommentDeleteDialog.bind(this, comment)} onReport={this.handleOpenReportDialog} />
            })}
            <ReportDialog open={this.state.reportDialog.isOpen} handleClose={this.handleCloseReportDialog} createReport={this.createReport}/>
            <ConfirmDeleteCommentDialog isOpen={this.state.deleteDialog.isOpen} handleCancle={this.closeCommentDeleteDialog} handleSubmit={this.submitCommentDeleteDialog} />
          </div>
        ) : (
            <NoComments />
        )

      }
     
      
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