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
    textAlign: 'center'
  },
  checkboxStyle: {
    margin: '40px auto 0 auto', 
    minWidth: '200px', 
    width: '200px'
  },
  submitButton: {
    marginTop: '50px',
    backgroundColor: 'rgb(27, 138, 174)',
    color: 'white'
  }
}

@inject("UserStore")
class FollowUserDialog extends Component {

  constructor(props) {
    super(props)
    this.state = {
      shouldFollow: false,
      isDialogOpen: true
    }
  }

  handleDialogClose = () => {
    const { UserStore, user } = this.props;
    if(this.state.shouldFollow) {
      UserStore.setFollowing(user.id);
    }
    this.setState({
      isDialogOpen: false
    })
  }

  handleCheckboxCheck = (e,value) => {
    this.setState({
      shouldFollow: value
    })
  }

  render() {
    const { user } = this.props;
    const userName = `${user.first_name} ${user.last_name}`;
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
          I'm working with Represent to modernize democracy &nbsp;  
           <a>Learn more</a>
        </p>

        <div>
          <Checkbox
            label={`Follow ${userName}`}
            labelPosition='right'
            labelStyle={{ }}
            style={styles.checkboxStyle}
            onCheck={this.handleCheckboxCheck}
            checked={this.state.shouldFollow}
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
      </Dialog>
    )
  }
}

            // value={props.value}
            // checked={props.checked}

export default FollowUserDialog;