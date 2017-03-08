import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionAdminGUI from '../CollectionAdminGUI';
import { arrayMove } from 'react-sortable-hoc';
import Dialog from 'material-ui/Dialog';

@inject("QuestionStore", "CollectionStore") @observer class CreateCollection extends Component {

  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      endText: "",
      questions: [],
      items: [],
      errorMessage: false
    }
  }

  render() {

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
          <FlatButton label="Cancel" style={{float: 'right'}} onClick={() => this.props.push("/")}/>
          <RaisedButton label="Save" primary={true} style={{float: 'left'}} onClick={() => {
            this.props.CollectionStore.createCollection(this.state.title, this.state.description, this.state.endText, this.state.questions)
              .then(function(collectionId) {
                this.props.QuestionStore.loadCollectionQuestions(collectionId);
                this.props.push("/collection/" + collectionId + "/edit");
              }.bind(this)).catch(function(reason) {
                console.log("FAILED");
                this.setState({errorMessage: reason});
              }.bind(this));
          }} />
        </div>

        <Dialog title="Warning" actions={<RaisedButton label="Close" primary={true} onTouchTap={() => this.setState({errorMessage: false})}/>} modal={false} open={this.state.errorMessage ? true : false} onRequestClose={() => this.setState({errorMessage: false})}>{this.state.errorMessage ? this.state.errorMessage : null}</Dialog>
      </div>
    )
  }
}

export default CreateCollection;
