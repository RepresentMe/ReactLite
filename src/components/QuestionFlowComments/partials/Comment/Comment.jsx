import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover/Popover';
import {Menu, MenuItem} from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import moment from 'moment'

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

import './style.css';

const {
  FacebookShareButton,
  TwitterShareButton
} = ShareButtons;


const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const COMMENT_MAX_SIZE_TO_SHOW = 140

@inject("UserStore", "QuestionCommentsStore")
@observer
class Comment extends Component {

constructor(props) {

  super(props)
    this.state = {
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      },
      shouldBeTruncated: false,
      readMore: false
    }
  }

  handleSharePopoverOpen = (event) => {
    // This prevents ghost click.
    event.preventDefault();
    const {currentTarget} = event;
    this.setState({
      sharePopover: {
        isOpen: true,
        curAnchorEl: currentTarget
      }
    })
  }

  handleSharePopoverClose = () => {
    this.setState({
      sharePopover: {
        isOpen: false,
        curAnchorEl: null
      }
    });
  }

  componentWillMount() {
    if (this.props.comment.text.length > 140) {
      this.setState({ shouldBeTruncated: true})
    }
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button${this.props.comment.id}`)[0].click()
  }

  clickTwitter = (e) => {
    document.getElementsByClassName(`twitter-network__share-button${this.props.comment.id}`)[0].click()
  }

  readMoreClick = () => {
    this.setState({readMore: true})
  }


  render() {
    const { comment, UserStore, onDelete, onReport, question } = this.props
    const { question_info, id } = comment

    const shareUrl = `https://app.represent.me/question/${question_info.id}/${question.slug}/comment${id}/`;
    const title = `${comment.user.first_name} ${comment.user.last_name} commented question`
    const picture = question.ogImage || `https://share.represent.me/graphic/${question.id}.png`

    const { shouldBeTruncated, readMore } = this.state

    let truncatedComment
    if (shouldBeTruncated) {
      truncatedComment = comment.text.substring(0, COMMENT_MAX_SIZE_TO_SHOW)
    }

    const fb = (
    <FacebookShareButton
      url={shareUrl}
      title={title}
      picture={picture}
      className={`fb-network__share-button${comment.id}`}>
      <FacebookIcon
        size={32}
        round />
    </FacebookShareButton>
  )

    const twitter = (
      <TwitterShareButton
        url={shareUrl}
        title={title}
        className={`twitter-network__share-button${comment.id}`}>
        <TwitterIcon
          size={32}
          round />
      </TwitterShareButton>
    )

    return (
      <div className="comment">
        {/*<Votes />*/}
        <div className="content">
          <div className="comment-data">
            <a className="author">
              <img src={comment.user.photo} />
              <span className="name">{comment.user.first_name} {comment.user.last_name}</span>
            </a>
            <div className="pull-right">
              <span className="type text-xs">info</span>
              <span className="author-answer text-xs s-agree">Strongly disagree</span>
            </div>
            <div className="comment-text">
               {
                shouldBeTruncated ? (
                 <TruncatedCommentCase readMore={readMore} comment={comment} truncatedComment={truncatedComment} onClick={this.readMoreClick}/>
                ) : (
                  <p>{comment.text}</p>
                )
               }
            </div>
          </div>
          <div className="buttons">
            <a className="reply">Reply</a>
            <span className="dot"> · </span>
            <a className="change-answer">Change my answer</a>
            <span className="dot"> · </span>
            <span className="date">{moment(comment.modified_at).format('DD MMM')}</span>
            <span className="dot"> · </span>
            <a className="report" onClick={onReport} >Report</a>
            <span className="dot"> · </span>
            <a className="share" onClick={this.handleSharePopoverOpen}>Share</a>

            <Popover
              open={this.state.sharePopover.isOpen}
              anchorEl={this.state.sharePopover.curAnchorEl}
              onRequestClose={this.handleSharePopoverClose}
            >
              <Menu>
                <MenuItem primaryText="Share in FB" 
                          leftIcon={fb} 
                          onClick={this.clickFB} 
                />

                <MenuItem primaryText="Share in Twitter" 
                          leftIcon={twitter}
                          onClick={this.clickTwitter} 
                /> 
              </Menu>
            </Popover>
            {UserStore.isLoggedIn() && UserStore.userData.get("id") == comment.user.id && (<span>
              <span className="dot"> · </span>
              <a className="delete" onClick={onDelete} >Delete</a>
            </span>)}

          </div>
        </div>
      </div>
    );
  }
}

const TruncatedCommentCase = ({ readMore, comment, truncatedComment, onClick}) => (
  <div>
    {
      readMore ? (
        <p>{comment.text} 1488</p>
      ) : (
        <p> {`${truncatedComment}...`} 
        <a className="change-answer" onClick={onClick}> Read more</a>
        </p>

      )
    }
  </div>
)

export default Comment;