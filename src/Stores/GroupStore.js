import { observable, autorun } from 'mobx';

class GroupStore {


  joinGroup(data) {
    const { groupId, shareEmail } = data;
    return window.API.post(`/api/groups/${groupId}/join/`, {default_share_email: shareEmail});
  }

}

export default GroupStore;
