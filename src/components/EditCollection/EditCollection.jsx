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
    let collectionId = parseInt(this.props.match.params.collectionId);
    CollectionStore.getCollectionById(collectionId).then(() => {
      this.fillDetailsFromStore();
    })
    CollectionStore.getCollectionItemsById(collectionId).then((items) => {
      const questions = CollectionStore.collectionItems.get(collectionId);
      this.setState({ questions, hasCollectionQuestions: true });
      console.log('will mount', questions);

    });
  }
  
  addItem = (obj) => {
     this.props.CollectionStore.setCollectionQuestionById(obj)
  }

  saveItems = () => {
    let curItems = this.props.CollectionStore.collectionItems.get(this.collectionId);
    let newItems = [];
    this.state.questions.forEach((question, j) => {
      for (let i = 0; i < curItems.length; i++) {
        if(curItems[i].object_id == question.id) {
          curItems.order = j;
          newItems.push(curItems);
          break;
        }
      }
    })
  }

  render() {
    let collectionId = parseInt(this.props.match.params.collectionId);

    let questions = null;
    let question_objects = null;
    let question_breaks = null;
    console.log('RENDER', this.state.questions, this.state.questions.length);
    if(!this.state.questions || this.state.questions.length == 0) {
      return <LinearProgress mode="indeterminate" />;
    } else {
      this.props.CollectionStore.getCollectionItemsById(collectionId);
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
            console.log('sortQuestion: ', oldIndex, newIndex);
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
