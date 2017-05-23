import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import Progress from 'react-progressbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SkipToEnd from 'material-ui/svg-icons/navigation/last-page';

import {Helmet} from "react-helmet";

import QuestionFlow from '../QuestionFlow'
import DynamicConfigService from '../../services/DynamicConfigService';
import './SurveyFlow.css'

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class SurveyFlow extends Component {

  constructor() {
    super()

    this.state = {
      collection: null,
      collectionItems: null,
      networkError: false,
      activeTab: 'vote',
      session_vars: null
    }
    this.dynamicConfig = DynamicConfigService;

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

    console.log('pATCH', this.props.match.params.dynamicConfig);
    // if(this.props.match.params.dynamicConfig) {
    //   this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    // }

    this.setState({activeTab: this.props.match.params.activeTab})

    //create session analytics variables
    //currently turned off - function calls 3rd party api to get geo details
    //this.getUserIP();
    const analytics_browser = window.navigator.appCodeName; //Browser details
    const analytics_os = window.navigator.appVersion.slice(0,100); //OS
    const analytics_parent_url = window.parent.location.href.slice(0,200); //parent url (for embed) or current url in other cases
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
    // this.getUserLocation();
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.activeTab !== nextProps.match.params.activeTab) {
      this.setState({activeTab: nextProps.match.params.activeTab})
    }
  }

  //gets longitude, latitude, and acccuracy in meters
  //gets info from navigator and stores it in localStorage
  getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(({coords}) => {
      const { latitude, longitude, accuracy } = coords
      const location = [latitude, longitude, accuracy]
      try { localStorage.setItem('location', location) }
      catch (err) { console.log(err) }
    },
    err => {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    })
  }

  onVote(i, votingMode) {
    if(!this.props.UserStore.userData.has("id")){
      this.props.history.push("/login/" + this.dynamicConfig.getEncodedConfig());
    } else {
      let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
      const userLocation = localStorage.getItem('location')
      const analytics_location = userLocation ? userLocation : null
      const sessionData = [
        question.id, i, this.state.collection.id, votingMode,
        this.state.session_vars.analytics_os,
        this.state.session_vars.analytics_browser,
        this.state.session_vars.analytics_parent_url,
        analytics_location
      ]
      if(question.subtype === 'likert') {
        this.props.QuestionStore.voteQuestionLikert(
          ...sessionData
        )
      } else if(question.subtype === 'mcq') {
        this.props.QuestionStore.voteQuestionMCQ(
          ...sessionData
        )
      }
      this.navigateNext()
    }
  }

  navigateNext() {
    if (parseInt(this.props.match.params.itemNumber) + 1 === this.state.collectionItems.length) {
      // this.navigateEnd()
      this.navigateEnd2()
    } else {
      this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) + 1) + '/vote/' + this.dynamicConfig.getEncodedConfig())
    }
  }

  navigatePrevious() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) - 1) + '/vote/' + this.dynamicConfig.getEncodedConfig())
  }

  navigateN(n) {
    if ((n) === this.state.collectionItems.length) {
      // this.navigateEnd()
      this.navigateEnd2()
    } else {
      const nextUrl = `/survey/${this.props.match.params.surveyId}/flow/${n}/vote/`;
      this.dynamicConfig.addRedirect(nextUrl);
      this.props.history.push(nextUrl+this.dynamicConfig.getEncodedConfig());
    }
  }

  navigateTab(tab) {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + this.props.match.params.itemNumber + '/' + tab + '/' + this.dynamicConfig.getEncodedConfig())
  }

  navigateEnd() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/end/' + this.dynamicConfig.getEncodedConfig())
  }

  navigateEnd2() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/end2/' + this.dynamicConfig.getEncodedConfig())
  }

  render() {
    const items = this.state.collectionItems
    const currentItemIndex = this.props.match.params.itemNumber

    let completed = 0
    if (items && items.length) {
      completed = currentItemIndex / (items.length - 1) * 100
    }

    return (
      <span>
         <Progress completed={completed} color="#1b8aae"/>
         
{/*
         {
           //if user is logged show button to navigate to EndScreen
           this.props.UserStore.userData.has("id") &&

            <IconButton
              tooltip="skip to end"
              touch={true}
              tooltipPosition="bottom-left"
              onTouchTap={() => this.navigateEnd2()} 
              style={{position: 'absolute', right: 12, top: -9}}>
              <SkipToEnd color='#999' hoverColor='#1B8AAE' />
            </IconButton>
         }
       */}
          <QuestionFlow
            activeTab={this.state.activeTab}
            items={items}
            currentItemIndex={currentItemIndex}
            onVote={this.onVote}
            navigateN={this.navigateN}
            navigateNext={this.navigateNext}
            navigateTab={this.navigateTab}
          />
          {this.state.collection ? <OgTags collection={this.state.collection} /> : null}
      </span>
  )}
}


const OgTags = ({collection}) => {
  const og = {
    title: collection.name+' - Represent' || "Represent: Democracy as it should be. Survey",
    image: collection.photo || 'https://represent.me/assets/img/ogimage.jpg',
    desc: collection.desc || "We’re modernising democracy. Join the Heard. And Survey"
  }
  return (<Helmet>
    <meta property="og:url" content={og.url} />
    <meta property="og:title" content={og.title} />
    <meta property="og:image" content={og.image} />
    <meta property="og:description" content={og.desc} />
  </Helmet>)
}

export default SurveyFlow
