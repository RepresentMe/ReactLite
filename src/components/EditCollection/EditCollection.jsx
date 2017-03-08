import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionAdminGUI from '../CollectionAdminGUI';
import { arrayMove } from 'react-sortable-hoc';
import LinearProgress from 'material-ui/LinearProgress';

@inject("QuestionStore", "CollectionStore", "UserStore") @observer class EditCollection extends Component {

  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      endText: "",
      questions: [],
      hasCollectionDetails: false,
      hasCollectionQuestions: false,
    }

    this.fillDetailsFromStore = this.fillDetailsFromStore.bind(this);
    this.checkForUpdates = this.checkForUpdates.bind(this);
  }

  fillDetailsFromStore() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    let storeCollection = this.props.CollectionStore.collections.get(collectionId);
    this.setState({
      title: storeCollection.name,
      description: storeCollection.desc,
      endText: storeCollection.end_text,
      hasCollectionDetails: true
    });
  }

  checkForUpdates() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    if(this.props.CollectionStore.collections.has(collectionId) && !this.state.hasCollectionDetails) { // Are the collection details already cached?
      this.fillDetailsFromStore();
    }else {
      this.props.CollectionStore.getCollection(collectionId);
    }

    if(this.props.QuestionStore.collectionQuestions.has(collectionId) && !this.state.hasCollectionQuestions) { // Are the collection questions already cached?
      this.setState({ questions: this.props.QuestionStore.collectionQuestions.get(collectionId), hasCollectionQuestions: true });
    }else {
      this.props.QuestionStore.loadCollectionQuestions(collectionId);
    }
  }

  componentWillMount() {
    this.checkForUpdates();
  }

  componentWillReact() { // Called every time the store updates (Requires a reference to store in render())
    let collectionId = parseInt(this.props.match.params.collectionId); // Check if user is the owner of the collection, otherwise navigate away
    if(this.props.UserStore.userData.has("id") && this.props.CollectionStore.collections.get(collectionId).user.id !== this.props.UserStore.userData.get("id")) {
      this.props.push("/");
    }
    this.checkForUpdates();
  }

  render() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    if(!this.props.CollectionStore.collections.has(collectionId) || !this.props.QuestionStore.collectionQuestions.has(collectionId) || !this.props.UserStore.userData.has("id")) {
      return <LinearProgress mode="indeterminate" />;
    }

    return (
      <div>
        <CollectionAdminGUI
          title={this.state.title}
          description={this.state.description}
          endText={this.state.endText}
          questions={this.state.questions}

          textChange={(field, newValue) => {
            let newState = this.state;
            newState[field] = newValue
            this.setState(newState);
          }}

          addQuestion={(question) => {
            this.setState({questions: this.state.questions.concat([question])});
          }}

          removeQuestion={(question) => {
            let newQuestions = this.state.questions;
            let removeQuestionIndex = newQuestions.indexOf(question);
            newQuestions.splice(removeQuestionIndex, 1);
            this.setState({questions: newQuestions});
          }}

          sortQuestion={(oldIndex, newIndex) => {
            this.setState({questions: arrayMove(this.state.questions, oldIndex, newIndex)});
          }}
          />
          <div style={{margin: '40px 10px'}}>
            <FlatButton label="Cancel" style={{float: 'right'}} onClick={() => this.props.push("/")} />
            <RaisedButton label="Save" primary={true} style={{float: 'left'}} onClick={() => {
              this.props.QuestionStore.updateCollectionQuestions(collectionId, this.state.questions);
              this.props.CollectionStore.updateCollection(collectionId, this.state.title, this.state.description, this.state.endText);
              this.props.push("/collection/" + collectionId);
            }} />
          </div>
      </div>
    )
  }
}

export default EditCollection;
