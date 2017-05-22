import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import ArrowForward from 'material-ui/svg-icons/navigation/arrow-forward';
import { green100 } from 'material-ui/styles/colors';

@inject("CollectionStore") @observer class CollectionSearch extends Component {

  constructor() {
    super();
    this.state = {
      search: ""
    }
  }

  render() {

    let existingQuestionDialogResults = this.props.CollectionStore.searchCollections(this.state.search);

    return (

      <div>
        <div style={{width: '80%', minWidth: 200, margin: '0 auto'}}>
          <TextField
            value={this.state.search}
            hintText="Search"
            fullWidth={true}
            onChange={(e, newValue) => {
              this.setState({search: newValue});
            }} />
        </div>

        <List>
          {this.state.search.length >= 3 && existingQuestionDialogResults && existingQuestionDialogResults.map((collectionId, index) => {

            return (
              <Link to={ "/survey/" + collectionId } style={{textDecoration: 'none'}} key={index}><ListItem onClick={() => {}}
                hoverColor={green100}
                primaryText={this.props.CollectionStore.collections.get(collectionId).name}
                rightIcon={<ArrowForward />}
                /></Link>
            );
          })}
        </List>

      </div>

    );
  }

}

export default CollectionSearch;
