import React, { Component } from 'react';
import CompareCollectionUsers from './partials/CompareUsersComponent'

// @inject("CollectionStore", "QuestionStore", "UserStore") 
// @observer 
class EndScreen extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <CompareCollectionUsers />
      </div>
    );
  }
}

export default EndScreen;
