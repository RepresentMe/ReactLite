import React, { Component } from 'react'

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
    if (this.props.text.length > 140) {
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

    let truncatedComment;
    if (shouldBeTruncated) {
      truncatedComment = (shouldBeTruncated) ? text.substring(0, COMMENT_MAX_SIZE_TO_SHOW) : text
    }
    const buttonStyle={
      cursor: 'pointer'
    }

    return (
      <div className="moreText">
        {
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