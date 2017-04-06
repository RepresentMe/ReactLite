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
import QuestionPopulationStackedChart from "../charts/QuestionPopulationStackedChart";
import FacebookImg from './iconmonstr-facebook-5.svg';
import TwitterImg from './iconmonstr-twitter-5.svg';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import CodeTags from 'material-ui-community-icons/icons/code-tags';
import IconButton from 'material-ui/IconButton';
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';

import './CollectionEnd.css';

const questionShareLink = (questionId) => {
  if(window.self !== window.top) { // In iframe
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(document.referrer);
  }else { // Top level
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(location.href);
  }
}

const FacebookShareButton = (props) => (
  <FacebookButton appId={window.authSettings.facebookId} element="span" url={props.url}>
    <img src={FacebookImg} />
  </FacebookButton>
)

const TwitterShareButton = (props) => (
  <TwitterButton appId={window.authSettings.facebookId} element="span" url={props.url}>
    <img src={TwitterImg} />
  </TwitterButton>
)


const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
    padding: 24,
  },
  large: {
    width: 120,
    height: 120,
    padding: 30,
  },
};

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class CollectionEnd extends Component {

  constructor() {
    super();

    this.state = {
      showMessengerDialog: true,
      showEmbedDialog: false,
    }
  }

  componentWillMount() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.items(collectionId); // Buffers the questions
    }

    this.props.CollectionStore.items(collectionId);
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

    let messengerRefData = "get_started_with_token";
    let authToken = this.props.UserStore.getAuthToken();
    if(authToken) {
      messengerRefData += "+auth_token=" + authToken;
    }

    return (
      <div>

        <Card style={{margin: '0'}} zDepth={0}  >
          <CardMedia overlay={<CardTitle title={ collection.name } subtitle={ collection.end_text } />}>
            <div style={cardMediaCSS}></div>
          </CardMedia>
          <CardActions>
            <div style={{textAlign: 'center'}}>
              <FacebookButton appId={window.authSettings.facebookId} element="span" url={document.referrer}><IconButton iconStyle={styles.mediumIcon} style={styles.medium}><FacebookBox color={indigo500} /></IconButton></FacebookButton>
              <TwitterButton element="span" url={document.referrer}><IconButton iconStyle={styles.mediumIcon} style={styles.medium}><TwitterBox color={blue500} /></IconButton></TwitterButton>
              <IconButton iconStyle={styles.mediumIcon} style={styles.medium}><CodeTags color={bluegrey500} onClick={() => this.setState({showEmbedDialog: true})}/></IconButton>
            </div>
          </CardActions>
        </Card>

        {false && this.props.CollectionStore.items(collectionId) &&

          <Card style={{margin: '10px', overflow: 'hidden'}}>
            <CardText>
              {this.props.CollectionStore.items(collectionId).map((collectionItem, index) => {
                return (
                  <div className="CollectionEndResult" key={index}>
                    <QuestionPopulationStackedChart questionId={collectionItem.object_id} geoId={59} height={100}/>
                    <p style={{margin: '5px'}}>{this.props.QuestionStore.questions.has(collectionItem.object_id) && this.props.QuestionStore.questions.get(collectionItem.object_id).question}</p>
                    <FacebookShareButton url={questionShareLink(collectionItem.object_id)} /> <TwitterShareButton url={questionShareLink(collectionItem.object_id)} />
                  </div>
                )
              })}
            </CardText>
          </Card>

        }

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

        <Dialog
            title="Embed this on your website"
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
            value={'<iframe width="700" height="400" src="https://' + window.location.host + '/survey/' + collection.id + '"></iframe>'}
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
