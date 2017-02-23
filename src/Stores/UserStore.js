import { observable, autorun } from 'mobx';
import axios from 'axios';

class UserStore {

  userData = observable.shallowMap({});
  sessionData = observable.map({
    authToken: "",
    showUserDialogue: false
  });

  getMe() {
    if(!this.sessionData.has("authToken")) {
      return false;
    }

    axios.get('/auth/me/')
      .then(function (response) {
        this.userData.replace(response.data);
      }.bind(this));

  }

  authYeti(provider, access_token) {
    axios.post('/auth-yeti/', { provider, access_token })
      .then(function (response) {
        if(response.data.auth_token && response.data.id) {
          this.sessionData.set("authToken", response.data.auth_token);
          axios.defaults.headers.common['Authorization'] = "Token " + response.data.auth_token;
          this.getMe();
        }
      }.bind(this));
  }

  toggleUserDialogue() {
    this.sessionData.set("showUserDialogue", !this.sessionData.get("showUserDialogue"));
  }

}

export default UserStore;
