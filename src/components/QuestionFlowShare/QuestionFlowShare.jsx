import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { inject } from "mobx-react"

import RaisedButton from 'material-ui/RaisedButton';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import FontIcon from 'material-ui/FontIcon';

import './style.css';

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton
} = ShareButtons;


const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const WhatsappIcon = generateShareIcon('whatsapp');

const style = {
  innerPaperStyle: {

  },
  pageWrapperPaper: {
  },
  textFieldStyle: {
    margin: 30,
    maxWidth: 400
  },
  button: {
    margin: 12,
  }
};

@inject("UserStore")
class QuestionFlowShare extends Component {

  constructor(props) {
    super(props);
    this.state = {
      shareText: ''
    }
  }

  onInputChange = (e) => {
    this.setState({
      shareText: e.target.value
    })
  }

  countShare = () => {
    this.props.UserStore.countShareClicks({
      analytics_interface: 'collection',
      url: `https://app.represent.me/question/${this.props.question.id}/`
    })
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button`)[0].click();
    this.countShare();
  }

  clickTwitter = (e) => {
    document.getElementsByClassName(`twitter-network__share-button`)[0].click();
    this.countShare();
  }

  clickWhatsApp = (e) => {
    document.getElementsByClassName(`whatsapp-network__share-button`)[0].click();
    this.countShare();
  }

  render() {
    const { question } = this.props
    const { innerPaperStyle,
            textFieldStyle,
            pageWrapperPaper,
            button
    } = style

    const imgSrc = `http://share.represent.me/graphic/${question.id}.png`
    const shareUrl = `https://app.represent.me/question/${question.id}/`;
    const { shareText } = this.state

    const fb = (
    <FacebookShareButton
      url={shareUrl}
      title={shareText}
      picture={imgSrc}
      className='fb-network__share-button'>
      <FacebookIcon
        size={32}
        round />
    </FacebookShareButton>
  )

    const twitter = (
      <TwitterShareButton
        url={shareUrl}
        title={shareText}
        className='twitter-network__share-button'>
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
    )

    const whatsapp =  (
      <WhatsappShareButton
        url={shareUrl}
        title={shareText}
        separator=":: "
        className="whatsapp-network__share-button">
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>
    )


    return (
      <div className='share-tab'>

        <Paper style={pageWrapperPaper} zDepth={0}>

          <Paper style={innerPaperStyle} zDepth={0}>
            <img src={imgSrc} className='img-share'/>
          </Paper>
          <Paper style={innerPaperStyle} zDepth={0}>
            <TextField
              hintText="Say something about this (optional)"
              multiLine={true}
              fullWidth
              style={textFieldStyle}
              rowsMax={4}
              value={shareText}
              onChange={this.onInputChange}
            />
          </Paper>
          <Paper style={innerPaperStyle} zDepth={0}>
             <RaisedButton
              onTouchTap={this.clickFB}
              label="Share"
              style={button}
              backgroundColor="#3b5998"
              icon={fb}
            />
            <RaisedButton
              onTouchTap={this.clickTwitter}
              label="Tweet"
              backgroundColor="#1da1f2"
              style={button}
              icon={twitter}
            />
            <RaisedButton
              onTouchTap={this.clickWhatsApp}
              backgroundColor="#3EAC18"
              label="WhatsApp"
              icon={whatsapp}
            />
          </Paper>
        </Paper>

      </div>
    )
  }
}

export default QuestionFlowShare;
