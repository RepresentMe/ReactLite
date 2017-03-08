import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { white, cyan600, green100 } from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import Add from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';


const styles = {
  floatingLabelText: {
    color: cyan600,
  },
  textField: {

  }
}

@inject("QuestionStore") @observer class CollectionAdminGUI extends Component { // The view only for the collection editor and creator

  constructor() {
    super();

    this.state = {
      showAddExistingQuestionDialog: false,
      existingQuestionDialogText: ""
    }
  }

  render() {

    let existingQuestionDialogResults = null;

    if(this.state.showAddExistingQuestionDialog && this.state.existingQuestionDialogText.length > 1) {
      if(!isNaN(parseFloat(this.state.existingQuestionDialogText)) && isFinite(this.state.existingQuestionDialogText)) { // If numeric, check for question ID
        if(this.props.QuestionStore.questions.has(parseInt(this.state.existingQuestionDialogText))) { // Is question exists in DB, render
          existingQuestionDialogResults = [parseInt(this.state.existingQuestionDialogText)]
        }else { // Otherwise load question and wait for rerender
          this.props.QuestionStore.loadQuestion(parseInt(this.state.existingQuestionDialogText));
        }
      }else { // Not numeric, perform a text search
        existingQuestionDialogResults = this.props.QuestionStore.searchQuestions(this.state.existingQuestionDialogText);
      }
    }

    return (
      <div>
        <Paper zDepth={0} style={{ margin: '20px' }}>
          <TextField onChange={(e, newValue) => this.props.textChange('title', newValue)} value={this.props.title} style={styles.textField} floatingLabelText="Collection Title" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} underlineShow={false} />
          <Divider />
          <TextField onChange={(e, newValue) => this.props.textChange('description', newValue)} value={this.props.description} style={styles.textField} floatingLabelText="Collection Description" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} multiLine={true} underlineShow={false} />
          <Divider />
          <TextField onChange={(e, newValue) => this.props.textChange('endText', newValue)} value={this.props.endText} style={styles.textField} floatingLabelText="Ending Text" hintText="Shown after users have completed the collection" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} multiLine={true} underlineShow={false} />
        </Paper>
        <Paper zDepth={2} style={{ margin: '10px' }}>
          <Toolbar style={{backgroundColor: cyan600, color: white}}>
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle text="Questions (Drag to reorder)" style={{marginLeft: '20px', color: white}} />
            </ToolbarGroup>
            <ToolbarGroup>
              <IconMenu
                iconButtonElement={
                  <IconButton touch={true}>
                    <Add color={white} />
                  </IconButton>
                }
                >
                <MenuItem primaryText="Add an existing question" onClick={() => this.setState({showAddExistingQuestionDialog: true})} />
                <MenuItem primaryText="Create a new question" disabled={true} />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>

          <SortableQuestions
            items={this.props.questions.map((question, index) => {
              if(this.props.QuestionStore.questions.has(question)) {
                return this.props.QuestionStore.questions.get(question)
              }else {
                this.props.QuestionStore.loadQuestion(question);
                return null;
              }
            })}
            useDragHandle={false}
            lockAxis="y"
            onSortEnd={({oldIndex, newIndex}) => this.props.sortQuestion(oldIndex, newIndex)}
            onRemove={this.props.removeQuestion}
            />
        </Paper>

        <Dialog
            title="Add an Existing Question"
            actions={
              <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.setState({showAddExistingQuestionDialog: false})}
              />
            }
            modal={false}
            open={this.state.showAddExistingQuestionDialog}
            onRequestClose={() => this.setState({showAddExistingQuestionDialog: false})}
          >


          <TextField value={this.state.existingQuestionDialogText} style={styles.textField} hintText="Question or ID" fullWidth={true} onChange={(e, newValue) => {
            this.setState({existingQuestionDialogText: newValue});
          }} />


          <List>

            {existingQuestionDialogResults && existingQuestionDialogResults.map((question, index) => {
              return (
                <ListItem onClick={() => {
                    this.setState({showAddExistingQuestionDialog: false});
                    this.setState({existingQuestionDialogText: ""});
                    this.props.addQuestion(this.props.QuestionStore.questions.get(question).id);
                  }}
                  key={index}
                  hoverColor={green100}
                  primaryText={this.props.QuestionStore.questions.get(question).question}
                  rightIcon={<Add />}
                  />
              );
            })}

          </List>

        </Dialog>
      </div>
    );
  }
}

const SortableQuestions = SortableContainer(({items, onRemove}) => {
  return (
    <List>
      {items.map((value, index) => {
        if(!value) {
          return <SortableQuestionLoading key={`item-${index}`} index={index}/>;
        }else {
          return <SortableQuestion key={`item-${index}`} index={index} value={value} orderNumber={(index + 1)} onRemove={() => onRemove(value.id)} />
        }
      })}
    </List>
  )
});

const SortableQuestion = SortableElement(({value, orderNumber, onRemove}) => {
  return (
    <ListItem primaryText={value.question} rightIcon={<Clear onClick={onRemove}/>}/>
  )
});

const SortableQuestionLoading = SortableElement(() => {
  return (
    <ListItem primaryText="loading..." disabled={true}/>
  )
});

var SortableQuestionHandle = SortableHandle(({orderNumber}) => <span>{orderNumber}</span>);

export default CollectionAdminGUI;
