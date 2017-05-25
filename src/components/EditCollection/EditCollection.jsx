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

  constructor(props) {
    super(props);

    this.collectionId = props.match.params.collectionId;
    this.state = {
      title: "",
      description: "",
      endText: "",
      questions: [],
      hasCollectionDetails: false,
      hasCollectionQuestions: false,
    }

    this.fillDetailsFromStore = this.fillDetailsFromStore.bind(this);
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

  componentWillMount() {
    const { CollectionStore } = this.props;
    CollectionStore.getCollectionById(this.collectionId).then(() => {
      this.fillDetailsFromStore();
    })
    CollectionStore.getCollectionItemsById(this.collectionId).then((items) => {
      const questions = CollectionStore.collectionItems.get(this.collectionId);
      this.setState({ questions, hasCollectionQuestions: true });
    });
  }

  addItem = (obj) => {
     this.props.CollectionStore.setCollectionQuestionById(obj).then((items) => {
        this.setState({
          questions: items
        })
     })
  }

  saveCollection = () => {
    const { CollectionStore } = this.props;
    CollectionStore.updateCollection(this.collectionId, this.state.title, this.state.description, this.state.endText);
    CollectionStore.updateCollectionItems(this.collectionId, this.state.questions);

    // this.props.push("/survey/" + collectionId);
  }

  render() {
    let questions = null;
    let question_objects = null;
    let question_breaks = null;


    if(!this.state.questions || this.state.questions.length == 0) {
      return <LinearProgress mode="indeterminate" />;
    } else {
      this.props.CollectionStore.getCollectionItemsById(this.collectionId);
      questions = this.state.questions;
      question_objects = questions.filter(q => q.type === "Q").map(q => this.props.QuestionStore.questions.get(q.object_id))
    }

    return (
      <div>
        {this.state.questions && this.state.questions.length > 0 &&
        <div>
        <CollectionAdminGUI
          title={this.state.title}
          description={this.state.description}
          endText={this.state.endText}
          items={questions}
          question_objects={question_objects}
          //question_breaks={question_breaks}
          collectionId={this.collectionId}

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
            <RaisedButton label="Save" primary={true} style={{float: 'left'}} onClick={() => this.saveCollection()}
            />
            </div>

          </div>}
      </div>
    )
  }
}

export default EditCollection;
