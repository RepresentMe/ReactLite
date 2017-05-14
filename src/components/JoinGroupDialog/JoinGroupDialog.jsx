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
      isDialogOpen: this.props.isOpen,
      group: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isOpen && nextProps.groupId && (!this.state.group || nextProps.groupId != this.state.group.id)) {
      this.props.GroupStore.getGroup(nextProps.groupId).then((res) => {
        this.setState({
          isDialogOpen: true,
          group: res
        })
      })
    }
  }

  handleDialogClose = () => {
    const { GroupStore } = this.props;
    if(this.state.shouldJoin) {
      GroupStore.joinGroup({
        groupId: this.state.group.id,
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
    return (
      <Dialog
        modal={true}
        open={this.state.isDialogOpen}
        contentStyle={styles.contentStyle}
      >

        {!this.state.group && 'Loading...'}
        {this.state.group && <div>
          <div className="user-rep-icons-wrapper">
            <div className="user-rep-icons">
              <div className="user-icon">
                <img src={this.state.group.image} />
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
              label={`Follow ${this.state.group.name} on Represent`}
              labelPosition='right'
              style={styles.firstCheckboxStyle}
              onCheck={this.handleJoinCheckboxCheck}
              checked={this.state.shouldJoin}
              />
            <Checkbox
              label={`Share my url with ${this.state.group.name}`}
              labelPosition='right'
              onCheck={this.handleEmailCheckboxCheck}
              checked={this.state.shouldShareEmail}
              />
          </div>

          <div className="submit-button-wrapper">
            <FlatButton
              label="Continue"
              primary={true}
              disabled={false}
              onTouchTap={this.handleDialogClose}
              style={styles.submitButton}
            />
          </div>
        </div>}
      </Dialog>
    )
  }
}

export default JoinGroupDialog;