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
    height: 150,
    width: '80%',
    margin: 5,
    textAlign: 'center',
    display: 'inline-block'
  },
  pageWrapperPaper: {
    height: '60%',
    width: '90%',
    textAlign: 'center',
    margin: 'auto',
    marginTop: 15
  },
  textFieldStyle: {
    margin: 30,
    width: '80%'
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

        <Paper style={pageWrapperPaper} zDepth={1}>
          <Paper style={innerPaperStyle} zDepth={0}>
            <TextField
              hintText="Type your text here"
              multiLine={true}
              fullWidth
              style={textFieldStyle}
              rowsMax={4}
              value={shareText}
              onChange={this.onInputChange}
            />
          </Paper>
          <Paper style={innerPaperStyle} zDepth={0}>
            <img src={imgSrc} className='img-share'/>
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