import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import MessengerPlugin from 'react-messenger-plugin';
import { FacebookButton, TwitterButton } from "react-social";
import Slider from 'react-slick';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import CodeTags from 'material-ui-community-icons/icons/code-tags';
import IconButton from 'material-ui/IconButton';
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import QuestionPopulationStackedChart from '../charts/QuestionPopulationStackedChart';
import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart';
import CompareCollectionUsers from '../CompareCollectionUsers';
import DynamicConfigService from '../../services/DynamicConfigService';

import './CollectionEnd.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const questionShareLink = (questionId) => {
  if(window.self !== window.top) { // In iframe
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(document.referrer);
  }else { // Top level
    return "https://share-test.represent.me/scripts/share.php?question=" + questionId + "&redirect=" + encodeURIComponent(location.href);
  }
}

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class CollectionEnd extends Component {

  constructor() {
    super();

    this.state = {
      showMessengerDialog: true,
    }

  }

  componentWillMount() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.getCollectionItemsById(collectionId);
    }

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }

    this.setState({
      showMessengerDialog: this.dynamicConfig.config.survey_end.messenger_prompt
    })
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
        </Card>

        <CollectionEndUserCompare userIds={this.dynamicConfig.config.survey_end.compare_users} />

        <CollectionEndShare collection={collection} />

        {this.props.CollectionStore.collectionItems.has(collectionId) &&
          <CollectionEndQuestionPieCharts items={this.props.CollectionStore.collectionItems.get(collectionId)}/>
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

      </div>
    );

  }

  getQuestionShareLink() {

  }

}

class CollectionEndShare extends Component {

  constructor() {
    super()
    this.state = {
      showEmbedDialog: false
    }
  }

  render() {
    return (
      <ResponsiveCardContainer>
        <Card containerStyle={{padding: 0}}>
          <CardText style={{textAlign: 'center', padding: 0}}>

            <FacebookButton appId={window.authSettings.facebookId} element="span" url={document.referrer}>
            <FlatButton
              label="Share on Facebook"
              fullWidth={true}
              icon={<FacebookBox color={indigo500} />}/>
            </FacebookButton>

            <TwitterButton element="span" url={document.referrer}><FlatButton
              href="https://github.com/callemall/material-ui"
              target="_blank"
              label="Share on Twitter"
              fullWidth={true}
              icon={<TwitterBox color={blue500} />}/>
            </TwitterButton>

            <FlatButton
              onClick={() => this.setState({showEmbedDialog: true})}
              target="_blank"
              label="Embed this Survey"
              fullWidth={true}
              icon={<CodeTags color={bluegrey500} />}/>
          </CardText>
        </Card>
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
            value={'<iframe width="700" height="400" src="https://' + window.location.host + '/survey/' + this.props.collection.id + '"></iframe>'}
            fullWidth={true}
            multiLine={true}
          />

        </Dialog>
      </ResponsiveCardContainer>
    )
  }

}

@inject("QuestionStore") @observer class CollectionEndQuestionPieCharts extends Component {
  render() {

    var settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      prevArrow: <KeyboardArrowLeft/>,
      nextArrow: <KeyboardArrowRight/>,
    };

    return (
      <ResponsiveCardContainer>
        <Card>
          <CardText style={{margin: '0 10px'}}>
            <Slider {...settings}>
              {this.props.items.map((item, index) => {
                if(item.type === "Q") {
                  return (
                  <div key={index}>
                    <p style={{textAlign: 'center'}}>{this.props.QuestionStore.questions.get(item.object_id).question}</p>
                    <QuestionLiquidPiechart questionId={item.object_id}/>
                  </div>
                  )
                }
              })}
            </Slider>
          </CardText>
        </Card>
      </ResponsiveCardContainer>
    )
  }

}

const CollectionEndUserCompare = ({userIds}) => {
  if(userIds.length === 0) {
    return null
  }else {
    return (
    <div style={{float: 'left', width: '50%', padding: '10px', boxSizing: 'border-box'}}>
      <CompareCollectionUsers userIds={userIds} />
    </div>
    )
  }
}

const ResponsiveCardContainer = (props) => {
  return <div {...props} className="ResponsiveCardContainer"/>
}

export default CollectionEnd;
