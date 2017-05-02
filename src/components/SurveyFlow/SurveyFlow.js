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
    }

    this.onVote = this.onVote.bind(this)
    this.navigateNext = this.navigateNext.bind(this)
    this.navigatePrevious = this.navigatePrevious.bind(this)
    this.navigateN = this.navigateN.bind(this)
    this.navigateTab = this.navigateTab.bind(this)
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
  }

  componentWillReceiveProps(nextProps) {
    if(this.state.activeTab != nextProps.match.params.activeTab) {
      this.setState({activeTab: nextProps.match.params.activeTab})
    }
  }

  render() {
    return <QuestionFlow activeTab={this.state.activeTab} items={this.state.collectionItems} currentItemIndex={this.props.match.params.itemNumber} onVote={this.onVote} navigateN={this.navigateN} navigateTab={this.navigateTab}/>
  }

  onVote(i) {
    let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
    if(question.subtype === 'likert') {
      this.props.QuestionStore.voteQuestionLikert(question.id, i, this.state.collection.id, true)
    }else if(question.subtype === 'mcq') {
      this.props.QuestionStore.voteQuestionMCQ(question.id, i, this.state.collection.id, true)
    }
    this.navigateNext()
  }

  navigateNext() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) + 1) + '/vote/' + this.dynamicConfig.encodeConfig())
  }

  navigatePrevious() {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + (parseInt(this.props.match.params.itemNumber) - 1) + '/vote/' + this.dynamicConfig.encodeConfig())
  }

  navigateN(n) {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + n + '/vote/' + this.dynamicConfig.encodeConfig())
  }

  navigateTab(tab) {
    this.props.history.push('/survey/' + this.props.match.params.surveyId + '/flow/' + this.props.match.params.itemNumber + '/' + tab + '/' + this.dynamicConfig.encodeConfig())
  }
}

export default SurveyFlow
