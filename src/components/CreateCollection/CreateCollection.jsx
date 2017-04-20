import React, { Component } from 'react';
import { observer, inject } from "mobx-react";

import CollectionAdminView from '../CollectionAdminView'

@inject("QuestionStore", "CollectionStore") @observer class CreateCollection extends Component {

  constructor() {
    super();
    this.state = {
      title: "",
      description: "",
      endText: "",
      items: [],
    }

    this.handleItemAdd = this.handleItemAdd.bind(this)
  }

  render() {

    return (
      <div>
        <CollectionAdminView items={this.state.items} onItemAdd={this.handleItemAdd} onItemRemove={this.handleItemRemove} />
      </div>
    )
  }

  handleItemAdd(item) {
    let items = this.state.items
    items.push(item)
    this.setState({items})
  }

  handleItemRemove(index) {

  }
}

export default CreateCollection;
