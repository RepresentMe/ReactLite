import React, { Component } from 'react';
import { observable } from 'mobx';
import { observer, inject } from "mobx-react";
import CompareCollectionUsers from './partials/CompareUsersComponent';
import DynamicConfigService from '../../services/DynamicConfigService';
import JoinGroupDialog from '../JoinGroupDialog';
import FollowUserDialog from '../FollowUserDialog';
import MessengerModal from './partials/MessengerModal';
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
      userDataModal: {
        user: null,
        isOpen: false
      },
      messengerModal: {
        isOpen: false
      }
    }
    
    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }

  componentWillMount(){ // WEIRD CODE WRITTED IN LAST NIGHT BEFORE DEPLOY
    this.props.UserStore.getCachedMe().then(data => {
      if(!this.isUserDataSet(data)) {
        this.setState({ 
          userDataModal: {
            user: data, 
            isOpen: true
          }
        })
      } else {
        this.checkToShowJoinGroupModal();
      }
    })
  }

  checkToShowJoinGroupModal() { 
    const { GroupStore } = this.props;
    if(this.dynamicConfig.config.survey_end.showJoinGroup_id) {
      GroupStore.getGroup(this.dynamicConfig.config.survey_end.showJoinGroup_id).then((group) => {
        if(!group.my_membership) {
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
          if(following.results.length == 0) {
            this.setState({
              followUserModal: {
                isOpen: true,
                userId: this.dynamicConfig.config.survey_end.showFollowUser_id
              }
            }) 
          } else {
            this.checkToShowFollowUserModal()
          }
        })
      })
    } else {
      this.checkToShowFollowUserModal()
    }
  }

  checkToShowFollowUserModal() {
    if(true) {
      this.setState({
        messengerModal: {
          isOpen: true
        }
      })
    }
  }

  isUserDataSet(user) {
    return (user.dob && typeof user.gender == 'number' && user.address !== "");
  }

  render() {
    console.log('renderEndScreen');
    const usersToCompare = observable.shallowArray(this.dynamicConfig.config.survey_end.compare_users)
    return (
      <div>
        <CompareCollectionUsers userIds={usersToCompare} collectionId={this.props.match.params.collectionId}/>
        <MoreUserInfo shown={this.state.userDataModal.isOpen} user={this.state.userDataModal.user} />
        <JoinGroupDialog isOpen={this.state.joinGroupModal.isOpen} groupId={this.state.joinGroupModal.groupId}/>
        <FollowUserDialog isOpen={this.state.followUserModal.isOpen} userId={this.state.followUserModal.userId}/>
        {/*<MessengerModal isOpen={this.state.messengerModal.isOpen} />*/}
      </div>
    );
  }
}

export default EndScreen;
