import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';

const COMMENT_MAX_SIZE_TO_SHOW = 140;

class MoreText extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      shouldBeTruncated: false,
      readMore: false
    }
  }

  componentWillMount() {
    if (!this.props.chars && this.props.text.length > 140) {
      this.setState({ shouldBeTruncated: true })
    }
    else if (this.props.chars && this.props.text.length > this.props.chars) {
      this.setState({ shouldBeTruncated: true })
    } else {
      this.setState({ readMore: true })
    }
  }

  readMoreClick = () => {
    this.setState({ readMore: true })
  }

  render() {
    const { text } = this.props;
    const { shouldBeTruncated, readMore } = this.state;

    let truncatedComment = '';
    if (shouldBeTruncated) {
      if (!this.props.chars) truncatedComment = text.substring(0, COMMENT_MAX_SIZE_TO_SHOW)
      else if (this.props.chars) truncatedComment = text.substring(0, this.props.chars)
    }
    const buttonStyle={
      cursor: 'pointer'
    }
    console.log('truncatedComment', truncatedComment, this.props)
    return (
      <div className="moreText">
        {this.props.markdownEnabled ?
          readMore ? (
            <ReactMarkdown source={ text } className="markDownText" renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}} />
            ) : (
              <div>
                <ReactMarkdown source={ truncatedComment } className="markDownText" renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}} />
                <a style={buttonStyle} onClick={this.readMoreClick}> Read more</a>
              </div>
            ) :
            readMore ? (
              <p>{text}</p>
            ) : (
                <p> {`${truncatedComment}...`}
                  <a style={buttonStyle} onClick={this.readMoreClick}> Read more</a>
                </p>
              )
        }
      </div>
    )
  }
}

export default MoreText
