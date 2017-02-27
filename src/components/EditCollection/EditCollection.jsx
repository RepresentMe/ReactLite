import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionEditor from '../CollectionEditor';
import { arrayMove } from 'react-sortable-hoc';
import CircularProgress from 'material-ui/CircularProgress';

@inject("QuestionStore", "CollectionStore") @observer class CreateCollection extends Component {

  constructor() {
    super();

    this.state = {
      title: "",
      description: "",
      endText: "",
      questions: [],
      hasCollection: false,
    }

    //this.populateCollection = this.populateCollection.bind(this);
    this.fillStateFromStore = this.fillStateFromStore.bind(this);
  }

  /*
  populateCollection() {
    let collectionId = parseInt(match.params.collectionId);
    let collection = CollectionStore.collections.get(collectionId);

    if(!collection) {
      return null;
    }

    if(!this.props.CollectionStore.collections.has(collectionId)) {
      return false;
    }else {
      this.setState({
        title: collection.name,
        description: collection.desc,
        endText: end_text
      });
    }
  }
  */

  fillStateFromStore() {
    console.log("populating");
    let collectionId = parseInt(this.props.match.params.collectionId);
    let storeCollection = this.props.CollectionStore.collections.get(collectionId);
    this.setState({
      title: storeCollection.name,
      description: storeCollection.desc,
      endText: storeCollection.end_text
    });
  }

  componentWillMount() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(this.props.CollectionStore.collections.has(collectionId)) { // Collection already loaded
      this.fillStateFromStore();
    }else {
      this.props.CollectionStore.getCollection(collectionId);
    }
  }

  componentWillReact() {
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.state.hasCollection && this.props.CollectionStore.collections.has(collectionId)) {
      this.fillStateFromStore();
    }
  }

  render() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    if(!this.props.CollectionStore.collections.has(collectionId)) {
      return <CircularProgress size={80} thickness={5} />;
    }

    return (
      <div>
        <CollectionEditor
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
            <RaisedButton label="Cancel" primary={true} style={{float: 'right', marginLeft: '10px'}} />
            <RaisedButton label="Create" primary={true} style={{float: 'right'}} onClick={() => {
              this.props.CollectionStore.createCollection(this.state.title, this.state.description, this.state.endText, this.state.questions);
            }} />
          </div>
      </div>
    )
  }
}

export default CreateCollection;
