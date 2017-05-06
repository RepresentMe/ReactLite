import React, { Component } from 'react';

// import RaisedButton from 'material-ui/RaisedButton';

import './style.css';
// import postButtonsStyle from './postButton.js'

// @inject("CollectionStore")
class AddComment extends Component {
  // componentWillMount(nextProps) {
  //   this.props.CollectionStore.getComments()
  // }
  constructor(props) {
    super(props)
    this.state = {
     comment: ''
    }
    this.onSend = this.onSend.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  onSend() {
    console.log('sand clicked')
    console.log(this.state.comment)
  }

  handleChange(e) {
    this.setState({comment: e.target.value});
  }

  render() {
    return (

      <div className="add-comment-wrapper">
        <div className="add-comment">
          <button className="add-comment-btn" onClick={this.onSend} >Send</button>
          {/* TODO <RaisedButton label="Primary" primary={true} />*/}
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