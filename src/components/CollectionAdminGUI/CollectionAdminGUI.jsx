import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { observable } from "mobx";
import { Link } from 'react-router-dom';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import { white, cyan600, green100, red500 } from 'material-ui/styles/colors';
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

@inject("QuestionStore")
@observer
class CollectionAdminGUI extends Component { // The view only for the collection editor and creator

  constructor() {
    super();


    this.existingQuestionDialogResults = observable.shallowArray([])
    this.state = {
      showAddExistingQuestionDialog: false,
      existingQuestionDialogText: "",
      showAddBreakDialog: false,
      addBreakDialogTitle: "",
      addBreakDialogText: "",
    }
  }

  render() {
    console.log('this.props.QuestionStore',this.props.QuestionStore)
    console.log('this.state',this.state)


    if(this.state.showAddExistingQuestionDialog && this.state.existingQuestionDialogText.length > 1) {
      if(!isNaN(parseFloat(this.state.existingQuestionDialogText)) && isFinite(this.state.existingQuestionDialogText)) { // If numeric, check for question ID
        if(this.props.QuestionStore.questions.has(parseInt(this.state.existingQuestionDialogText))) { // Is question exists in DB, render
          this.existingQuestionDialogResults.replace([parseInt(this.state.existingQuestionDialogText)])
        }else { // Otherwise load question and wait for rerender
          this.props.QuestionStore.loadQuestion(parseInt(this.state.existingQuestionDialogText));
        }
      }else { // Not numeric, perform a text search
        console.log('Entered else')
         this.props.QuestionStore.searchQuestions(this.state.existingQuestionDialogText).then(res => {
          this.existingQuestionDialogResults.replace(res.map(q => this.props.QuestionStore.questions.get(q)));
          });
      }
    }
    let existingQuestionDialogResults = this.existingQuestionDialogResults.peek();
    console.log('existingQuestionDialogResults', existingQuestionDialogResults)

    return (
      <div>

        <Paper zDepth={0} style={{ margin: '20px' }}> {/* Collection title, description and end text */}
          <TextField onChange={(e, newValue) => this.props.textChange('title', newValue)} value={this.props.title} style={styles.textField} floatingLabelText="Survey Title" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} underlineShow={false} />
          <Divider />
          <TextField onChange={(e, newValue) => this.props.textChange('description', newValue)} value={this.props.description} style={styles.textField} floatingLabelText="Survey Description" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} multiLine={true} underlineShow={false} />
          <Divider />
          <TextField onChange={(e, newValue) => this.props.textChange('endText', newValue)} value={this.props.endText} style={styles.textField} floatingLabelText="Ending Text" hintText="Shown at the end of a survey" floatingLabelFocusStyle={styles.floatingLabelText} fullWidth={true} multiLine={true} underlineShow={false} />
        </Paper>

        <Paper zDepth={0} style={{ margin: '10px' }}> {/* Drag and drop items toolbar */}
          <Toolbar style={{backgroundColor: cyan600, color: white}}>
            <ToolbarGroup firstChild={true}>
              <ToolbarTitle text="Content (Drag to reorder)" style={{marginLeft: '20px', color: white}} />
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
                <MenuItem primaryText="Add a break" onClick={() => this.setState({showAddBreakDialog: true})} />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>

          {/* Drag and drop items list */}
          <SortableQuestions
            items={this.props.items}
            question_objects={this.props.question_objects}
            useDragHandle={false}
            lockAxis="y"
            onSortEnd={({oldIndex, newIndex}) => this.props.sortQuestion(oldIndex, newIndex)}
            onRemove={this.props.removeQuestion}
            />
        </Paper>

        {/* Add break dialog */}
        <Dialog
            title="Add a Break"
            actions={[
              <FlatButton
                label="Cancel"
                secondary={true}
                onTouchTap={() => this.setState({showAddBreakDialog: false})}
              />,
              <FlatButton
                label="Add"
                onTouchTap={() => {

                  if(!this.state.addBreakDialogTitle) {
                    return
                  }

                  this.props.addItem({
                    parent: this.props.collectionId,
                    object_id: null,
                    type: 'B',
                    content_object: [{
                        title: this.state.addBreakDialogTitle,
                        text: this.state.addBreakDialogText
                      }]
                  });

                  this.setState({
                    showAddBreakDialog: false,
                    addBreakDialogTitle: "",
                    addBreakDialogText: "",
                  });

                }}
              />
            ]}
            modal={false}
            open={this.state.showAddBreakDialog}
            onRequestClose={() => this.setState({showAddBreakDialog: false})}
          >

          <TextField underlineStyle={!this.state.addBreakDialogTitle ? { borderColor: red500 } : {}} value={this.state.addBreakDialogTitle} style={styles.textField} hintText="Title" fullWidth={true} onChange={(e, newValue) => {
            this.setState({addBreakDialogTitle: newValue});
          }} />

          <TextField value={this.state.addBreakDialogText} style={styles.textField} hintText="Text" fullWidth={true} onChange={(e, newValue) => {
            this.setState({addBreakDialogText: newValue});
          }} />

        </Dialog>

        {/* Add existing question dialog */}
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
                    //this.props.addQuestion(this.props.QuestionStore.questions.get(question).id);
                    this.props.addItem({parent: this.props.collectionId, object_id: question.id, type: "Q", content_object: null});
                  }}
                  key={index}
                  hoverColor={green100}
                  primaryText={question.question}
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

// if(this.props.QuestionStore.questions.has(question)) {
//   return this.props.QuestionStore.questions.get(question)
// }else {
//   this.props.QuestionStore.loadQuestion(question);
//   return null;
// }

// {items.map((value, index) => {
//   if(!value) {
//     return <SortableQuestionLoading key={`item-${index}`} index={index}/>;
//   }else {
//     return <SortableQuestion key={`item-${index}`} index={index} value={value} orderNumber={(index + 1)} onRemove={() => onRemove(value.id)} />
//   }
// })}


const SortableQuestions = SortableContainer(({items, question_objects, onRemove}) => {
  return (
    <List>
      {items.map((item, index) => {
        if(item.type === "Q") { // Type is question
          // items.map((value, index) => {
          //   if(!value) {
          //     return <SortableQuestionLoading key={`item-${index}`} index={index}/>;
          //   }else {
          const item_display = question_objects.filter(q => q.id === item.object_id)
              return <SortableQuestion key={`item-${index}`} index={index} value={item_display[0]} orderNumber={(index + 1)} onRemove={() => onRemove(item.id)} />
            // }
          //})
        } else if(item.type === "B") { // Type is break
            return <SortableQuestion key={`item-${index}`} index={index} orderNumber={(index + 1)} onRemove={() => onRemove(item.id)} />
        }
      })}
    </List>
  )
});

const SortableQuestion = SortableElement(({value, orderNumber, onRemove}) => {
  return (
    <ListItem primaryText={value ? value.question : '------------------'} rightIcon={<Clear onClick={onRemove}/>}/>
  )
});

const SortableQuestionLoading = SortableElement(() => {
  return (
    <ListItem primaryText="loading..." disabled={true}/>
  )
});

var SortableQuestionHandle = SortableHandle(({orderNumber}) => <span>{orderNumber}</span>);

export default CollectionAdminGUI;
