import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import DynamicConfigService from '../../services/DynamicConfigService';

@inject("UserStore") @observer class AuthTokenComponent extends Component {

  componentWillMount() {
    let authtoken = this.props.match.params.authtoken;

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }

    this.props.UserStore.setupAuthToken(authtoken)
      .then((response) => {
        this.props.history.push(this.dynamicConfig.getNextRedirect());
      }).catch((error) => {
        console.log(error)
        //props.history.push("/login/" + props.match.params.redirect);
      })
  }

  render() {
    return <p>Loading...</p>
  }
}


export default AuthTokenComponent;
