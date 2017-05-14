import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import CompareCollectionUsers from './partials/CompareUsersComponent';
import DynamicConfigService from '../../services/DynamicConfigService';
import JoinGroupDialog from '../JoinGroupDialog';
import FollowUserDialog from '../FollowUserDialog';
import MoreUserInfo from '../Components/modals/MoreUserInfo';

@inject("UserStore", "GroupStore") 
@observer
class EndScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      joinGroupModal: {
        isOpen: false,
        groupId: null
      },
      followUserModal: {
        isOpen: false,
        groupId: null
      },
      openMoreInfo: false
    }
    
    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }

  componentWillMount() { // WEIRD CODE WRITTED IN LAST NIGHT BEFORE DEPLOY
    const { GroupStore } = this.props;
    if(false && 'userData') {
      // show user data config
    } else if(this.dynamicConfig.config.survey_end.showJoinGroup_id) {
      GroupStore.getGroup(this.dynamicConfig.config.survey_end.showJoinGroup_id).then((group) => {
        if(group.my_membership) {
          this.setState({
            joinGroupModal: {
              isOpen: true,
              groupId: this.dynamicConfig.config.survey_end.showJoinGroup_id
            }
          })
        } else { // check if follow user modal should be shown
          this.checkToShowFollowUserModal();
        }
      })
      
    } else {
      this.checkToShowFollowUserModal()
    }
    
  }

  checkToShowFollowUserModal() {
    const { UserStore } = this.props;
    if(this.dynamicConfig.config.survey_end.showFollowUser_id) {
      const userToFollowId = this.dynamicConfig.config.survey_end.showFollowUser_id;
      UserStore.getMe().then((curUser) => {
        UserStore.amFollowingUser(curUser.id, userToFollowId).then((following) => {
          if(following.results.length > 0) {
            this.setState({
              followUserModal: {
                isOpen: true,
                userId: this.dynamicConfig.config.survey_end.showFollowUser_id
              }
            }) 
          } else {
            // show messenger modal
          }
        })
      })
    } else {
      // show messenger modal
    }
  }

  componentDidMount(){
    this.props.UserStore.getCachedMe().then(data => {
      this.setState({ 
        user: data, 
        openMoreInfo: (!data.dob || data.gender === 0 || data.address === "") ? true : false
      })
    })
  }

  render() {
    console.log('isSHwoing', this.state);
    return (
      <div>
        <MoreUserInfo shown={this.state.openMoreInfo} user={this.state.user} />
        <CompareCollectionUsers />
        <JoinGroupDialog isOpen={this.state.joinGroupModal.isOpen} groupId={this.state.joinGroupModal.groupId}/>
        <FollowUserDialog isOpen={this.state.followUserModal.isOpen} userId={this.state.followUserModal.userId}/>
      </div>
    );
  }
}

export default EndScreen;
