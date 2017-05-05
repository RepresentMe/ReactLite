import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import QuestionFlow from '../QuestionFlow'
import DynamicConfigService from '../../services/DynamicConfigService';

@inject("CollectionStore", "QuestionStore") @observer class SurveyFlow extends Component {

  constructor() {
    super()

    this.state = {
      collection: null,
      collectionItems: null,
      networkError: false,
      activeTab: 'vote',
      session_vars: null
    }

    this.onVote = this.onVote.bind(this)
    this.navigateNext = this.navigateNext.bind(this)
    this.navigatePrevious = this.navigatePrevious.bind(this)
    this.navigateN = this.navigateN.bind(this)
    this.navigateTab = this.navigateTab.bind(this)
    this.navigateEnd = this.navigateEnd.bind(this)
  }

  componentWillMount() {
    this.props.CollectionStore.getCollectionById(parseInt(this.props.match.params.surveyId))
      .then((collection) => {this.setState({collection})})
      .catch((error) => {this.setState({networkError: true})})

    this.props.CollectionStore.getCollectionItemsById(parseInt(this.props.match.params.surveyId))
      .then((collectionItems) => {this.setState({collectionItems})})
      .catch((error) => {this.setState({networkError: true})})

    this.dynamicConfig = DynamicConfigService
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }

    this.setState({activeTab: this.props.match.params.activeTab})

    //create session analytics variables
    //const user = this.props.authToken ? this.props.UserStore.getMe() : null;
    //const user_id = user ? user.id : null; //id, if user is authed
    //const url = window.location.href; //current url
    //currently turned off - function calls 3rd party api to get geo details
    //this.getUserIP();
    const analytics_browser = window.navigator.appCodeName; //Browser details
    const analytics_os = window.navigator.appVersion.slice(0,100); //OS
    const analytics_parent_url = window.parent.location.href; //parent url (for embed) or current url in other cases
    const session_vars = Object.assign({},
      {
        analytics_os,
        analytics_browser,
        analytics_parent_url
      }
    )
    this.setState({session_vars})
  }
  componentDidMount(){
    this.getUserLocation();
    }

  componentWillReceiveProps(nextProps) {
    if(this.state.activeTab !== nextProps.match.params.activeTab) {
      this.setState({activeTab: nextProps.match.params.activeTab})
    }
  }

  //gets longitude, latitude, and acccuracy in meters
  //gets info from navigator and stores it in localStorage
  getUserLocation = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 2000,
      maximumAge: 0
    };
    var lat, lon, acc;

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    };

    function success(pos) {
      var crd = pos.coords;
      lat = crd.latitude;
      lon = crd.longitude;
      acc = crd.accuracy;

      let location = [lat, lon, acc]
      try { localStorage.setItem('location', location); }
      catch(err) { console.log(err); }
    };
    navigator.geolocation.getCurrentPosition(success, error, options);
  }

  //uses 3-party api - limitation 10k requests per hr
  /*getUserIP = () => {
    function parseJSON(response) {
        return response.json();
      }

    function checkStatus(response) {
        if (response.status >= 200 && response.status < 300) {
          return response;
        }

        const error = new Error(response.statusText);
        error.response = response;
        throw error;
      }

    function request(url, options) {
      return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then((data) => ({ data }))
        .catch((err) => ({ err }));
    }

    request('//freegeoip.net/json/')
    .then(geo => {
      this.setState({represent_app_analyticsession: Object.assign(this.state.represent_app_analyticsession, {geo: geo.data})})
    })
  }
*/

  onVote(i) {
    let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
    const analytics_location = localStorage.getItem('location').split(',');
    const sessionData = [
      question.id, i, this.state.collection.id, true,
      this.state.session_vars.analytics_os,
      this.state.session_vars.analytics_browser,
      this.state.session_vars.analytics_parent_url,
      analytics_location
    ]
    if(question.subtype === 'likert') {
      this.props.QuestionStore.voteQuestionLikert(
        ...sessionData
      )
    }else if(question.subtype === 'mcq') {
      this.props.QuestionStore.voteQuestionMCQ(
        ...sessionData
      )
    }
    this.navigateNext()
  }

  navigateNext() {
    if(parseInt(this.props.match.params.itemNumber + 1) > this.state.collectionItems.length) {
      this.navigateEnd()
    }else {
      this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) + 1) + '/vote/' + this.dynamicConfig.encodeConfig())
    }
  }

  navigatePrevious() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) - 1) + '/vote/' + this.dynamicConfig.encodeConfig())
  }

  navigateN(n) {
    if((n + 1) > this.state.collectionItems.length) {
      this.navigateEnd()
    }else {
      this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + n + '/vote/' + this.dynamicConfig.encodeConfig())
    }
  }

  navigateTab(tab) {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + this.props.match.params.itemNumber + '/' + tab + '/' + this.dynamicConfig.encodeConfig())
  }

  navigateEnd() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/end/' + this.dynamicConfig.encodeConfig())
  }
  render() {
    //console.log('this.state', this.state)
    return (
        <QuestionFlow activeTab={this.state.activeTab} items={this.state.collectionItems} currentItemIndex={this.props.match.params.itemNumber} onVote={this.onVote} navigateN={this.navigateN} navigateNext={this.navigateNext} navigateTab={this.navigateTab}/>
  )}
}



export default SurveyFlow