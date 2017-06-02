import React, { Component } from 'react'
import { observer, inject } from "mobx-react";
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';
import { white, cyan600, green100, red500 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import Add from 'material-ui/svg-icons/content/add';
import Clear from 'material-ui/svg-icons/content/clear';
import {List, ListItem} from 'material-ui/List';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import TextField from 'material-ui/TextField'
import Paper from 'material-ui/Paper'

const styles = {
  textField: {}
}

@inject("QuestionStore", "CollectionStore") class CollectionAdminView extends Component {

  /*

    This is the GUI shared between CreateCollection and EditCollection
    State of content (title, description, items) is handled by parent Component
    State of QuestionPicker and BreakComposer dialogs handled by this component

  */

  constructor() {
    super()
    this.state = {
      showQuestionPicker: false,
      showBreakComposer: false,
    }

    this.handleQuestionAdd = this.handleQuestionAdd.bind(this)
  }

  render() {
    return (
      <div style={{padding: '20px'}}>
        <TextField hintText="Survey title" style={styles.textField} fullWidth={true} />
        <TextField hintText="Survey description" style={styles.textField} fullWidth={true} />
        <TextField hintText="End text" style={styles.textField} fullWidth={true} />

        <Paper zDepth={0}> {/* Drag and drop items toolbar */}
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
                <MenuItem primaryText="Add an existing question" onClick={() => this.setState({showQuestionPicker: true})} />
                <MenuItem primaryText="Create a new question" disabled={true} />
                <MenuItem primaryText="Add a break" onClick={() => this.setState({showBreakComposer: true})} />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>

          <SortableItems items={this.props.items} useDragHandle={false} lockAxis="y" onSortEnd={({oldIndex, newIndex}) => this.props.sortQuestion(oldIndex, newIndex)} onRemove={this.props.removeQuestion} />
        </Paper>

        <QuestionPicker open={this.state.showQuestionPicker} onQuestionSelected={this.handleQuestionAdd} onClose={() => this.setState({showQuestionPicker: false})} />

        <BreakComposer open={this.state.showBreakComposer} onClose={() => this.setState({showBreakComposer: false})}/>

      </div>
    )
  }

  handleQuestionAdd(question) {
    //this.setState({showQuestionPicker: false})
    this.props.onItemAdd({
      type: 'Q',
      object_id: question
    })
  }

}

@inject("QuestionStore") class QuestionPicker extends Component {

  constructor() {
    super()
    this.state = {
      search: '',
      results: [],
    }

    this.handleQuestionSelected = this.handleQuestionSelected.bind(this)
  }

  render() {
    return (
      <Dialog title="Add an Existing Question" actions={<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.props.onClose()} />} modal={false} open={this.props.open} onRequestClose={() => this.props.onClose()}>
        <TextField value={this.state.search} style={styles.textField} hintText="Question or ID" fullWidth={true} onChange={(e, newValue) => this.setState({search: newValue})} />
        <List>
          {this.state.results.map((question, index) => <ListItem onClick={() => this.handleQuestionSelected(question)} key={index} hoverColor={green100} primaryText={this.props.QuestionStore.questions.get(question).question} rightIcon={<Add />}/>)}
        </List>
      </Dialog>
    )
  }

  handleQuestionSelected(question) {
    this.setState({search: ''}, () => this.props.onQuestionSelected(question))
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.search !== nextState.search) { // Search has been updated
      if(nextState.search === '') {
        this.setState({results: []})
      }else if(!isNaN(parseFloat(nextState.search)) && isFinite(nextState.search)) { // If numeric, check for question ID

      }else { // Not numeric, perform a text search
        this.props.QuestionStore.searchQuestions(this.state.search)
          .then((results) => {
            this.setState({results})
          })
          .catch((error) => {
            console.log(error)
          })
      }
    }
  }

}

class BreakComposer extends Component {

  constructor() {
    super()
    this.state = {
      title: '',
      body: ''
    }
  }

  render() {
    return (
      <Dialog title="Add a break" actions={<FlatButton label="Cancel" secondary={true} onTouchTap={() => this.props.onClose()} />} modal={false} open={this.props.open} onRequestClose={() => this.props.onClose()}>
        <TextField value={this.state.title} style={styles.textField} hintText="Break title" fullWidth={true} onChange={(e, newValue) => this.setState({title: newValue})} />
        <TextField value={this.state.body} style={styles.textField} hintText="Break body" fullWidth={true} onChange={(e, newValue) => this.setState({body: newValue})} multiLine={true} />
      </Dialog>
    )
  }
}

// const SortableQuestions = SortableContainer(({items, onRemove}) => {
//   return (
//     <List>
//       {this.state.results.map((question, index) => <ListItem key={index} hoverColor={green100} primaryText={this.props.QuestionStore.questions.get(question).question} rightIcon={<Add />}/>)}
//     </List>
//   )
// });

const SortableItems = inject("QuestionStore")(observer(SortableContainer(({ QuestionStore, items, onSortEnd }) => {
  return (
    <List>
      {items.map((item, index) => <SortableItem key={`item-${index}`} text={QuestionStore.questions.get(item.object_id).question} index={index}/>)}
    </List>
  )
})));

const SortableItem = SortableElement(({text, onSortEnd}) => {
  return (
    <ListItem primaryText={text} rightIcon={<Clear/>}/>
  )
});

const SortableQuestionLoading = SortableElement(() => {
  return (
    <ListItem primaryText="loading..." disabled={true}/>
  )
});

var SortableQuestionHandle = SortableHandle(({orderNumber}) => <span>{orderNumber}</span>);

export default CollectionAdminView
