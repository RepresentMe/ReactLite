import React, {Component} from 'react';
import { observer, inject } from "mobx-react";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';

import './styles.css'

const styles = {
  contentStyle: {
    width: '400px',
    padding: '10px 20px',
  },
  firstCheckboxStyle: {
    margin: '40px auto 0 auto',
  },
  submitButton: {
    marginTop: '50px',
    backgroundColor: 'rgb(27, 138, 174)',
    color: 'white'
  }
}

@inject("GroupStore")
class JoinGroupDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shouldJoin: false,
      shouldShareEmail: false,
      isDialogOpen: true
    }
  }

  handleDialogClose = () => {
    const { GroupStore, group } = this.props;
    if(this.state.shouldJoin) {
      GroupStore.joinGroup({
        groupId: group.id,
        shareEmail: this.state.shouldShareEmail
      });
    }
    this.setState({
      isDialogOpen: false
    })
  }

  handleJoinCheckboxCheck = (e,value) => {
    this.setState({
      shouldJoin: value
    })
  }

  handleEmailCheckboxCheck = (e,value) => {
    this.setState({
      shouldShareEmail: value
    })
  }

  render() {
    const { group } = this.props;
    return (
      <Dialog
        modal={true}
        open={this.state.isDialogOpen}
        contentStyle={styles.contentStyle}
      >
        <div className="user-rep-icons-wrapper">
          <div className="user-rep-icons">
            <div className="user-icon">
              <img src="/static/media/represent_white_outline.dbff67a6.svg" />
            </div>
            <div className="represent-icon">
              <img src="/static/media/represent_white_outline.dbff67a6.svg" />
            </div>
          </div>
        </div>

        <p>
          We're working with Represent to modernize democracy &nbsp;  
           <a>Learn more</a>
        </p>

        <div>
          <Checkbox
            label={`Follow ${group.name} on Represent`}
            labelPosition='right'
            style={styles.firstCheckboxStyle}
            onCheck={this.handleJoinCheckboxCheck}
            checked={this.state.shouldJoin}
            />
          <Checkbox
            label={`Share my url with ${group.name}`}
            labelPosition='right'
            onCheck={this.handleEmailCheckboxCheck}
            checked={this.state.shouldShareEmail}
            />
        </div>

        <div className="submit-button-wrapper">
          <FlatButton
            label="Submit"
            primary={true}
            disabled={false}
            onTouchTap={this.handleDialogClose}
            style={styles.submitButton}
          />
        </div>
      </Dialog>
    )
  }
}

export default JoinGroupDialog;