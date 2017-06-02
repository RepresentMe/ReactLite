 import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import Progress from 'react-progressbar';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import SkipToEnd from 'material-ui/svg-icons/av/fast-forward';

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
      //session_vars: null
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
    //if generalAnalyticsData is not loaded, load it into UserStore
    if (!this.props.UserStore.generalAnalyticsData.analytics_os){
      this.props.UserStore.getGeneralAnalyticsData();
    }
    this.props.CollectionStore.getCollectionById(parseInt(this.props.match.params.surveyId))
      .then((collection) => {this.setState({collection})})
      .catch((error) => {this.setState({networkError: true})})

    // this.props.CollectionStore.getCollectionItemsById(parseInt(this.props.match.params.surveyId))
    //   .then((collectionItems) => {
    //     this.setState({collectionItems})
    //   })
    //   .catch((error) => {this.setState({networkError: true})})

    let currentItemIndex = this.props.match.params.itemNumber;
    this.loadCollectionQuestions(currentItemIndex);

    this.setState({activeTab: this.props.match.params.activeTab})

    //create session analytics variables
    //currently turned off - function calls 3rd party api to get geo details
    //this.getUserIP();
    // var url = (window.location != window.parent.location)
    //         ? document.referrer
    //         : document.location.href;
    // const analytics_browser = window.navigator.appCodeName; //Browser details
    // const analytics_os = window.navigator.appVersion.slice(0,100); //OS
    // const analytics_parent_url = url.slice(0,200); //parent url (for embed) or current url in other cases
    // const session_vars = Object.assign({},
    //   {
    //     analytics_os,
    //     analytics_browser,
    //     analytics_parent_url
    //   }
    // )
    // this.setState({session_vars})
  }
  componentDidMount(){
    // this.getUserLocation();
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.activeTab !== nextProps.match.params.activeTab) {
      this.setState({activeTab: nextProps.match.params.activeTab})
    }
  }


  loadCollectionQuestions = (curItemIndex) => {
    let curPage = Math.ceil(curItemIndex/10);
    curPage = curPage == 0 ? 1 : curPage;
    const surveyId = this.props.match.params.surveyId;

    this.loadQuestionsByPage(curPage);

    if(curPage > 1) {
      setTimeout(() => {
        for (var i = 1; i < curPage; i++) {
          this.loadQuestionsByPage(i);
        }
      }, 350)
    }
  }

  loadQuestionsByPage = (page) => {
    const surveyId = this.props.match.params.surveyId;
    this.props.CollectionStore.getCollectionItemsByPage(surveyId, page)
      .then((res) => {
        this.setState((prevState) => {
          if(!prevState.collectionItems) {
            prevState.collectionItems = [];
            for (var j = 0; j < res.count; j++) {
              prevState.collectionItems[j] = null;
            }
          }
          for (var i = 0; i < res.results.length; i++) {
            prevState.collectionItems[(page-1)*10+i] = res.results[i];
          }
          return prevState.collectionItems;
        })
      })
  }

  loadNextQuestionsPage = (curIndex) => {
    let curPage = Math.ceil(curIndex/10);
    let nextIndex = curPage*10;
    let shouldLoadNextPage = nextIndex < this.state.collectionItems.length && !this.state.collectionItems[nextIndex];
    if(shouldLoadNextPage) {
      this.loadQuestionsByPage(curPage+1)
    }
  }

  //gets longitude, latitude, and acccuracy in meters
  //gets info from navigator and stores it in localStorage
  // getUserLocation = () => {
  //   navigator.geolocation.getCurrentPosition(({coords}) => {
  //     const { latitude, longitude, accuracy } = coords
  //     const location = [latitude, longitude, accuracy]
  //     try { localStorage.setItem('location', location) }
  //     catch (err) { console.log(err) }
  //   },
  //   err => {
  //     console.warn(`ERROR(${err.code}): ${err.message}`);
  //   })
  // }

  // onVote(i, votingMode) {
  //   if(!this.props.UserStore.userData.has("id")){
  //     this.props.history.push("/login/" + this.dynamicConfig.getEncodedConfig());
  //   } else {
  //     let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
  //     const userLocation = localStorage.getItem('location')
  //     const analytics_location = userLocation ? userLocation : null
  //     const sessionData = [
  //       question.id, i, this.state.collection.id, votingMode,
  //       this.state.session_vars.analytics_os,
  //       this.state.session_vars.analytics_browser,
  //       this.state.session_vars.analytics_parent_url,
  //       analytics_location
  //     ]
  //     if(question.subtype === 'likert') {
  //       this.props.QuestionStore.voteQuestionLikert(
  //         ...sessionData
  //       )
  //     } else if(question.subtype === 'mcq') {
  //       this.props.QuestionStore.voteQuestionMCQ(
  //         ...sessionData
  //       )
  //     }
  //     this.navigateNext()
  //   }
  // }

  onVote(i, votingMode) {
    if(!this.props.UserStore.userData.has("id")){
      this.props.history.push("/login/" + this.dynamicConfig.getEncodedConfig());
    } else {
      let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
      const userLocation = this.props.UserStore.generalAnalyticsData.get('analytics_location')
      const analytics_location = userLocation ? userLocation : null
      const sessionData = [
        question.id, i, this.state.collection.id, votingMode,
        this.props.UserStore.generalAnalyticsData.get('analytics_os'),
        this.props.UserStore.generalAnalyticsData.get('analytics_browser'),
        this.props.UserStore.generalAnalyticsData.get('analytics_parent_url'),
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
      this.loadNextQuestionsPage(parseInt(this.props.match.params.itemNumber));
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
      this.loadNextQuestionsPage(n);
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
    const currentItemIndex = this.props.match.params.itemNumber;

    let completed = 0
    if (items && items.length) {
      completed = (parseInt(currentItemIndex) + 1) / (items.length) * 100
    }

    return (
      <span>
         <Progress completed={completed} color="#1b8aae"/>


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
    url: `${window.location.origin}/survey/${collection.id}`,
    title: collection.name+' - #RepresentMe' || "Let's modernise democracy",
    image: collection.photo || 'http://i.imgur.com/wrW7xwp.png',
    desc: collection.desc || "Have your say!",
  }
  return (<Helmet>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@representlive" />
    <meta name="twitter:creator" content="@representlive" />
    <meta name="twitter:title" content={og.title} />
    <meta name="twitter:description" content={og.desc} />
    <meta name="twitter:image" content={og.image} />

    <meta property="og:url" content={og.url} />
    <meta property="og:title" content={og.title} />
    <meta property="og:type" content="website" />
    <meta property="fb:app_id" content="1499361770335561" />
    <meta property="og:image" content={og.image} />
    <meta property="og:description" content={og.desc} />
  </Helmet>)
}

export default SurveyFlow
