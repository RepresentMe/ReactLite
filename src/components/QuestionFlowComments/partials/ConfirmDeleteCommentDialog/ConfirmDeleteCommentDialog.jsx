import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

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


export default ConfirmDeleteCommentDialog;