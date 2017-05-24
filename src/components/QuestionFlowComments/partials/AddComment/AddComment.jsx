import React, { Component } from 'react';
import TextField from 'material-ui/TextField';

import IconButton from 'material-ui/IconButton';
import Send from 'material-ui/svg-icons/content/send';

import './style.css';

class AddComment extends Component {

  constructor(props) {
    super(props)
    this.state = {
     comment: ''
    }
    this.onSend = this.onSend.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSend() {
    const comment = {
      text: this.state.comment,
      question: this.props.question.id,
      subtype: 'info'
    }
    this.props.QuestionCommentsStore.createComment(comment)
      .then(() => this.setState({comment:''}))
      .catch(err => console.log(err))
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {
    const { comment } = this.state
    return (

      <div className="add-comment-wrapper"> 
   

            <TextField
      hintText=""
      floatingLabelText=""
      className="commentText"
      onChange={this.handleChange}
      value={comment}
      multiLine={true}
      underlineShow={false}
      rows={2}
    />

    <IconButton tooltip="Post comment" className="commentButton" touch={true} tooltipPosition="top-center" onClick={this.onSend} >
      <Send />
    </IconButton> 
      </div>


    );
  }
}


export default AddComment;