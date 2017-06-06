import React, { Component } from 'react';
import LinearProgress from 'material-ui/LinearProgress';
//import axios from 'axios';
import { white, cyan600 } from 'material-ui/styles/colors';

export default class NetworkProgress extends Component {

  constructor() {

    super();

    this.state = {
      axiosRequests: 0
    }

    window.API.interceptors.request.use(function (config) {
        this.setState({axiosRequests: this.state.axiosRequests + 1});
        return config;
      }.bind(this), function (error) {
        return Promise.reject(error);
      });

    window.API.interceptors.response.use(function (response) {
        if(this.state.axiosRequests === 1) {
          this.setState({axiosRequests: 0});
        }else {
          this.setState({axiosRequests: this.state.axiosRequests - 1});
        }
        return response;
      }.bind(this), function (error) {
        if(this.state.axiosRequests === 1) {
          this.setState({axiosRequests: 0});
        }else {
          this.setState({axiosRequests: this.state.axiosRequests - 1});
        }
        return Promise.reject(error);
      }.bind(this));

  }

  render() {

    if(this.state.axiosRequests === 0) {
      return <LinearProgress mode="determinate" value={0} color={ cyan600 } style={{backgroundColor: white}}  />
    }else {
      return <LinearProgress mode="indeterminate" color={ cyan600 } style={{backgroundColor: white}} />
    }

  }

}
