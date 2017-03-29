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
import QuestionResultsBarchart from "../charts/QuestionResultsBarchart";

@inject("CollectionStore", "QuestionStore") @observer class CollectionEnd extends Component {

  constructor() {
    super();

    this.state = {
      showMessengerDialog: false,
      showEmbedDialog: false,
    }
  }

  componentWillMount() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.items(collectionId); // Buffers the questions
    }
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let collection = this.props.CollectionStore.collections.get(collectionId);

    if(!collection) {
      return null;
    }

    let cardMediaCSS = {
      background: "linear-gradient(135deg, rgba(250,255,209,1) 0%,rgba(161,255,206,1) 100%)",
      height: '200px',
      overflow: 'hidden',
      backgroundSize: 'cover',
    }

    if(collection.photo) {
      cardMediaCSS.backgroundImage = 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')';
    }


    return (
      <div>

        <Card style={{margin: '10px'}}>
          <CardMedia overlay={<CardTitle title={ collection.name } subtitle="Thanks for completing this collection, your opinion will now be used as evidence by your representative and decision makers" />}>
            <div style={cardMediaCSS}></div>
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

        {/*<Card style={{margin: '10px'}}>
          <CardText>
            <QuestionResultsBarchart data={this.props.QuestionStore.questions.get(2452)}/>
          </CardText>
        </Card>*/}

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
              /></span>
            <span style={{float: 'right'}}><FlatButton label="Continue" style={{marginBottom: '10px'}} onClick={() => this.setState({showMessengerDialog: false})} /></span>

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
          Copy the following HTML into the source of your website, no additional setup required!
          <TextField
            value={'<iframe width="700" height="400" src="https://' + window.location.host + '/collection/' + collection.id + '"></iframe>'}
            fullWidth={true}
            multiLine={true}
          />

        </Dialog>

      </div>
    );

  }

  getQuestionShareLink() {

  }

}

export default CollectionEnd;
