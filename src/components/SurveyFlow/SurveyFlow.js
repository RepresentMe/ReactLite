import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import QuestionFlow from '../QuestionFlow'

@inject("CollectionStore", "QuestionStore") @observer class SurveyFlow extends Component {

  constructor() {
    super()

    this.state = {
      collection: null,
      collectionItems: null,
      networkError: false,
    }

    this.onVote = this.onVote.bind(this)
  }

  componentWillMount() {
    this.props.CollectionStore.getCollectionById(parseInt(this.props.match.params.surveyId))
      .then((collection) => {this.setState({collection})})
      .catch((error) => {this.setState({networkError: true})})

    this.props.CollectionStore.getCollectionItemsById(parseInt(this.props.match.params.surveyId))
      .then((collectionItems) => {this.setState({collectionItems})})
      .catch((error) => {this.setState({networkError: true})})
  }

  render() {
    return <QuestionFlow items={this.state.collectionItems} currentItemIndex={this.props.match.params.itemNumber} onVote={this.onVote}/>
  }

  onVote(i) {
    let question = this.props.QuestionStore.questions.get(this.state.collectionItems[this.props.match.params.itemNumber].object_id)
    if(question.subtype === 'likert') {
      this.props.QuestionStore.voteQuestionLikert(question.id, i, this.state.collection.id, true);
    }else if(question.subtype === 'mcq') {
      this.props.QuestionStore.voteQuestionMCQ(question.id, i, this.state.collection.id, true);
    }
  }
}

export default SurveyFlow
