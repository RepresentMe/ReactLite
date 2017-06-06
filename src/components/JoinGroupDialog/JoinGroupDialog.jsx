import React, {Component} from 'react';
import { inject } from "mobx-react";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import './styles.css'

const styles = {
  contentStyle: {
    width: '400px',
    padding: '5px !important',
    top: '-60px',
  },
  firstCheckboxStyle: {
    margin: '20px auto 0 auto',
  },
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
    if(nextProps.isOpen && nextProps.groupId && (!this.state.group || nextProps.groupId !== this.state.group.id)) {
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
     const actions = [
      <FlatButton
        label="Continue"
        primary={true}
        onTouchTap={this.handleDialogClose}
      />,
    ];


    return (
      <Dialog
        modal={true}
        open={this.state.isDialogOpen}
        contentStyle={styles.contentStyle}
        autoScrollBodyContent={true}
        actions={actions}
        bodyStyle={{padding: '10px'}}
        overlayStyle={{backgroundColor: 'white'}}
      >

        {!this.state.group && 'Loading...'}
        {this.state.group && <div>

          <table className="icons-wrapper-icon">
            <tr>
            <td width="50%" styles={{textAlign: 'right'}}>
              <img src={this.state.group.image} className="avatar" />
            </td>
            <td width="50%" styles={{textAlign: 'left'}}>
              <img src="/static/media/represent_white_outline.dbff67a6.svg"  className="avatar" />
            </td>
            </tr>
            </table>

          <p>
            We're working with Represent to modernise democracy. Please help us!
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
              label={`Share my email with ${this.state.group.name}`}
              labelPosition='right'
              onCheck={this.handleEmailCheckboxCheck}
              checked={this.state.shouldShareEmail}
              />
          </div>

           </div>}
      </Dialog>
    )
  }
}

export default JoinGroupDialog;
