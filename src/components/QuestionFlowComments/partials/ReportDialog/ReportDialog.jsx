import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

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
        onTouchTap={handleClose}
      />,
      <FlatButton
        label="Send" 
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

export default ReportDialog;