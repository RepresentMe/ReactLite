import React, { Component } from 'react';
import makeAsyncScriptLoader from 'react-async-script';

class MessengerCheckboxPlugin extends Component {

  constructor() {
    super();
  }

  initFacebookSDK() {

      const {FB} = this.props;

      if (FB) {
          FB.init({
              appId: this.props.appId,
              xfbml: true,
              version: 'v2.6'
          });
        }
  }

  componentDidMount() {
      this.initFacebookSDK();
  }

  componentDidUpdate() {
      this.initFacebookSDK();
  }

  render() {

    let markup = {
      __html: `<div class="fb-messenger-checkbox"
            origin="${window.location.href}"
            page_id="${this.props.pageId}"
            messenger_app_id="${this.props.appId}"
            user_ref="UNIQUE_REF"
            prechecked="true"
            allow_login="true"
            size="large"></div>`
    }

    return(
      <div dangerouslySetInnerHTML={markup}></div>
    )
  }
}

const URL = '//connect.facebook.net/en_US/sdk.js';

export default makeAsyncScriptLoader(MessengerCheckboxPlugin, URL, {
    globalName: 'FB'
});
