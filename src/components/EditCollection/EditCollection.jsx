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
    }else {
      this.props.CollectionStore.getCollectionItemsById(collectionId);
      const questions = this.props.CollectionStore.collectionItems.get(collectionId);
      this.setState({ questions, hasCollectionQuestions: true });
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
  addItem = (obj) => {
    this.props.CollectionStore.setCollectionQuestionById(obj)
    .then(res => this.checkForUpdates());

  }

  render() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    console.log(!this.props.CollectionStore.collections.has(collectionId), !this.props.CollectionStore.collectionItems.has(collectionId), !this.props.UserStore.userData.has("id"))

    let questions_init =  null;
    let questions = null;
    let question_objects = null;
    let question_breaks = null;
    if(!this.props.CollectionStore.collections.has(collectionId) || !this.props.CollectionStore.collectionItems.has(collectionId) || !this.props.UserStore.userData.has("id")) { //!this.props.QuestionStore.questions.has(collectionId) ||
      return <LinearProgress mode="indeterminate" />;
    }
    else {

      this.props.CollectionStore.getCollectionItemsById(collectionId);

      questions = this.questions.peek();
      // questions = questions.filter(q => q.type === "Q")
      // question_breaks = questions.filter(q => q.type === "B")
      question_objects = questions.filter(q => q.type === "Q").map(q => this.props.QuestionStore.questions.get(q.object_id))
    }
    console.log('this.state EDIT',this.state, questions, question_objects)
// =======
//       questions = this.props.CollectionStore.collectionItems.get(collectionId);
//       question_objects = questions.map(q => this.props.QuestionStore.questions.get(q.object_id))
//     }
//     console.log('this.state EDIT',this.state, question_objects)
// >>>>>>> 6b470874b91e3643e7a701ea6c8740764c4054f8
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
          //question_breaks={question_breaks}
          collectionId={collectionId}

          textChange={(field, newValue) => {
            let newState = this.state;
            newState[field] = newValue
            this.setState(newState);
          }}

          addItem={(obj) => this.addItem(obj)}

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
