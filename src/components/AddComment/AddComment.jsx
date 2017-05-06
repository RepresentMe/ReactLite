import React, { Component } from 'react';

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
      // question: this.props.question.object_id,
      question: 824,
      subtype: 'info'
    }
    this.props.QuestionCommentsStore.createComment(comment)
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {
    return (

      <div className="add-comment-wrapper">
        <div className="add-comment">
          <button className="add-comment-btn" onClick={this.onSend} >Send</button>
          <div className="add-comment-area-wrapper">
            <textarea className="add-comment-area" 
                      onChange={this.handleChange}
            />
          </div>
        </div>
      </div>);
  }
}


export default AddComment;