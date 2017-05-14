import React, {Component} from 'react';
import { observer, inject } from "mobx-react";
import MessengerPlugin from 'react-messenger-plugin';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const styles = {
}

@inject("UserStore")
class MessengerModal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showMessengerDialog: false
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      showMessengerDialog: nextProps.isOpen
    })
  }

  render() {
    let messengerRefData = "get_started_with_token";
    let authToken = this.props.UserStore.getAuthToken();
    if(authToken) {
      messengerRefData += "+auth_token=" + authToken;
    }
    return (
      <Dialog
          title="Want awesome powers?"
          modal={false}
          open={this.state.showMessengerDialog}
        >
          You can vote directly from facebook messenger, making it easy to have your say in important issues as often as you like. Try it out - we think you’ll love it!<br/><br/>
          <span style={{float: 'left'}}><MessengerPlugin
            appId={String(window.authSettings.facebookId)}
            pageId={String(window.authSettings.facebookPageId)}
            size="xlarge"
            passthroughParams={messengerRefData}
            /></span>
          <span style={{float: 'right'}}><FlatButton label="Continue" style={{marginBottom: '10px'}} onClick={() => this.setState({showMessengerDialog: false})} /></span>

      </Dialog>
    )
  }
}

export default MessengerModal;

