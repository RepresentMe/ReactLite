import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

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

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button`)[0].click()
  }

  clickTwitter = (e) => {
    document.getElementsByClassName(`twitter-network__share-button`)[0].click()
  }

  clickWhatsApp= (e) => {
    document.getElementsByClassName(`whatsapp-network__share-button`)[0].click()
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
        size={28}
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
          
          <Paper style={innerPaperStyle} zDepth={2}>
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
              onClick={this.clickFB} 
              label="Post to Facebook"
              style={button}
              primary={true}
              icon={fb}
            />
            <RaisedButton
              onClick={this.clickTwitter} 
              label="Tweet this"
              style={button}
              primary={true}
              icon={twitter}
            />
            <RaisedButton
              onClick={this.clickWhatsApp} 
              label="Whats App"
              primary={true}
              icon={whatsapp}
            />
          </Paper>
        </Paper>
        
      </div>
    )
  }
}

export default QuestionFlowShare;