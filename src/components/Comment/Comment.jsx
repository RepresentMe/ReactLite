import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import './style.css';

class Comment extends Component {

constructor(props) {

  super(props)
    this.state = {
     open: false
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  createReport = (text) => {
    this.props.store.createReport(text)
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
            <a className="report" onClick={this.handleOpen} >Report</a>

            <ReportDialog open={this.state.open} handleClose={this.handleClose} createReport={this.createReport}/>

          </div>
        </div>
      </div>
    );
  }
}

class ReportDialog extends Component {

  constructor(props) {
    super(props)

    this.state = {
      reportText: ''
    }
  }

  handleInputChange = (e) => {
    this.setState({ reportText: e.target.value} )
  }


  handleSand = () => {
    console.log(this.state.reportText)
    const { reportText } = this.state
    this.props.createReport(reportText)
  }


  render () {
    const { open, handleClose } = this.props 
    const { reportText } = this.state 

    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={handleClose}
      />,
      <FlatButton
        label="Sand"
        primary={true}
        onTouchTap={this.handleSand}
      />,
    ];

    return (
      <Dialog
        title="Get in touch"
        actions={actions}
        modal={true}
        open={open}
      >
      We love hearing from you and will reply to every message!
      <br/>
      <TextField
        hintText="What?! WHY?! Where? When?! HOW??!?"
        multiLine={true}
        fullWidth
        rowsMax={4}
        value={reportText}
        onChange={this.handleInputChange}
      />
      <br/>
      You don’t need to say which page you’re on - it’ll tell us!
      </Dialog>
    )
  }
}

export default Comment;