import React, { Component } from 'react';
import CompareCollectionUsers from './partials/CompareUsersComponent'
import MoreUserInfo from '../Components/modals/MoreUserInfo';
import { observer, inject } from "mobx-react";

@inject("CollectionStore", "QuestionStore", "UserStore") 
@observer 
class EndScreen extends Component {

  constructor(props) {
    super(props);
    this.state = { openMoreInfo: false }
  } 

  componentDidMount(){
    this.props.UserStore.getMe().then(data => {
      this.setState({ user: data, openMoreInfo: (!data.dob || data.gender === 0 || data.address === "") ? true : false})
      console.log(this.state)
    })
  }

  render() {
    return (
      <div>
        <MoreUserInfo shown={this.state.openMoreInfo} user={this.state.user} />
        <CompareCollectionUsers />
      </div>
    );
  }
}

export default EndScreen;
