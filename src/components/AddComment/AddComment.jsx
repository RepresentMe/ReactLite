import React, { Component } from 'react';

// import RaisedButton from 'material-ui/RaisedButton';

import './style.css';
// import postButtonsStyle from './postButton.js'

// @inject("CollectionStore")
class AddComment extends Component {
  // componentWillMount(nextProps) {
  //   this.props.CollectionStore.getComments()
  // }

  render() {
    return (

      <div className="add-comment-wrapper">
        <div className="add-comment">
          <button className="add-comment-btn">Send</button>
          {/* TODO <RaisedButton label="Primary" primary={true} />*/}
          <div className="add-comment-area-wrapper" ><textarea className="add-comment-area" /></div>
        </div>
      </div>);
  }
}


export default AddComment;