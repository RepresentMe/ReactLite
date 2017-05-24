import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
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
    this.questions = observable.shallowArray([])

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
    console.log('checkForUpdates COMPONENT')
    let collectionId = parseInt(this.props.match.params.collectionId);

    if(this.props.CollectionStore.collections.has(collectionId) && !this.state.hasCollectionDetails) { // Are the collection details already cached?
      console.log('checkForUpdates IF')
      this.fillDetailsFromStore();

    }else {
      console.log('checkForUpdates ELSE')
      this.props.CollectionStore.getCollection(collectionId);
    }

    if(this.props.QuestionStore.questions.has(collectionId) && !this.state.hasCollectionQuestions) { // Are the collection questions already cached?
      const questions = this.props.CollectionStore.collectionItems.get(collectionId);
      this.setState({ questions, hasCollectionQuestions: true });
      this.questions.replace(questions)
    }else {
      this.props.CollectionStore.getCollectionItemsById(collectionId);
      const questions = this.props.CollectionStore.collectionItems.get(collectionId);
      this.setState({ questions, hasCollectionQuestions: true });
      this.questions.replace(questions)
    }
  }

  componentWillMount() {
    this.checkForUpdates();
  }

  componentWillReact() { // Called every time the store updates (Requires a reference to store in render())
    let collectionId = parseInt(this.props.match.params.collectionId); // Check if user is the owner of the collection, otherwise navigate away
    // if(this.props.UserStore.userData.has("id") && this.props.CollectionStore.collections.get(collectionId).user.id !== this.props.UserStore.userData.get("id")) {
    //   this.props.push("/");
    // }
    this.checkForUpdates();
  }
  addItem = (collectionId, questionId, type) => {
    this.props.CollectionStore.setCollectionQuestionById(collectionId, questionId, type)
    .then(res => this.checkForUpdates());
    
  }

  render() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    console.log(!this.props.CollectionStore.collections.has(collectionId), !this.props.CollectionStore.collectionItems.has(collectionId), !this.props.UserStore.userData.has("id"))

    let questions = null;
    let question_objects = null;
    if(!this.props.CollectionStore.collections.has(collectionId) || !this.props.CollectionStore.collectionItems.has(collectionId) || !this.props.UserStore.userData.has("id")) { //!this.props.QuestionStore.questions.has(collectionId) ||
      return <LinearProgress mode="indeterminate" />;
    }
    else {

      this.props.CollectionStore.getCollectionItemsById(collectionId);
      questions = this.questions.peek();//props.CollectionStore.collectionItems.get(collectionId);
      question_objects = questions.map(q => this.props.QuestionStore.questions.get(q.object_id))
    }
    console.log('this.state EDIT',this.state, this.questions, question_objects)
    return (
      <div>
        {this.state.questions.length > 0 &&
        <div>
        <CollectionAdminGUI
          title={this.state.title}
          description={this.state.description}
          endText={this.state.endText}
          items={questions}
          question_objects={question_objects}
          collectionId={collectionId}

          textChange={(field, newValue) => {
            let newState = this.state;
            newState[field] = newValue
            this.setState(newState);
          }}

          addItem={(collectionId, questionId, type) => this.addItem(collectionId, questionId, type)}

          removeQuestion={(question) => {
            let newQuestions = questions.filter(q => q.id !== question);
            this.setState({questions: newQuestions});
          }}

          sortQuestion={(oldIndex, newIndex) => {
            this.setState({questions: arrayMove(questions, oldIndex, newIndex)});
          }}
          />
          <div style={{margin: '40px 10px'}}>
            <FlatButton label="Cancel" style={{float: 'right'}} onClick={() => this.props.push("/")} />
            <RaisedButton label="Save" primary={true} style={{float: 'left'}} onClick={() => {
              this.props.QuestionStore.updateCollectionQuestions(collectionId, this.state.questions);
              this.props.CollectionStore.updateCollection(collectionId, this.state.title, this.state.description, this.state.endText);
              this.props.push("/survey/" + collectionId);
            }}
            />
            </div>

          </div>}
      </div>
    )
  }
}

export default EditCollection;
