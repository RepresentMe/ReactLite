import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import { FacebookButton, TwitterButton } from "react-social";
import MessengerPlugin from 'react-messenger-plugin';
import TextField from 'material-ui/TextField';

@inject("CollectionStore") @observer class CollectionEnd extends Component {

  constructor() {
    super();
    this.state = {
      showMessengerDialog: true,
      messengerDialogScriptLoaded: false,
      showEmbedDialog: false,
    }
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let collection = this.props.CollectionStore.collections.get(collectionId);

    if(!collection) {
      return null;
    }

    return (
      <div>

        <Card style={{margin: '10px'}}>
          <CardMedia overlay={<CardTitle title={ collection.name } subtitle="Thanks for completing this collection, your opinion will now be used as evidence by your representative and decision makers" />}>
            <div style={{height: '200px', overflow: 'hidden', backgroundSize: 'cover', backgroundImage: 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')'}}></div>
          </CardMedia>
          <CardTitle
            title="Know someone passionate about this subject?"
            subtitle="Share this collection and help raise awareness for the causes you care about"
          />
          <CardActions>
            <FacebookButton appId={window.authSettings.facebookId} element="span" url={parent.document.URL}><RaisedButton label="Share on Facebook" primary style={{marginBottom: '10px'}} /></FacebookButton>
            <TwitterButton element="span" url={parent.document.URL}><RaisedButton label="Share on Twitter" primary style={{marginBottom: '10px'}} /></TwitterButton>
            <RaisedButton label="Embed on Your Site" primary style={{marginBottom: '10px'}} onClick={() => this.setState({showEmbedDialog: true})}/>
          </CardActions>
        </Card>

        <Dialog
            title="You can now recieve updates on this topic from your messenger inbox"
            modal={false}
            open={this.state.showMessengerDialog}
          >
            Answer daily questions, get updates about subscribed issues and connect with your local policy makers from your messenger inbox<br/><br/>
            <span style={{float: 'left'}}><MessengerPlugin
              appId={String(window.authSettings.facebookId)}
              pageId={String(window.authSettings.facebookPageId)}
              size="xlarge"
              asyncScriptOnLoad={() => this.setState({messengerDialogScriptLoaded: true})}
              /></span>
            {this.state.messengerDialogScriptLoaded && <span style={{float: 'right'}}><FlatButton label="Continue" style={{marginBottom: '10px'}} onClick={() => this.setState({showMessengerDialog: false})} /></span>}

        </Dialog>

        <Dialog
            title="Embed this collection on your website"
            modal={false}
            open={this.state.showEmbedDialog}
            actions={
              <FlatButton
                label="Close"
                onTouchTap={() => {
                  this.setState({showEmbedDialog: false});
                }}
              />
            }
          >
          <TextField
            value={'<iframe width="700" height="400" src="https://' + window.location.host + '/collection/' + collection.id + '"></iframe>'}
            fullWidth={true}
            multiLine={true}
          />

        </Dialog>

      </div>
    );

  }

}

export default CollectionEnd;
