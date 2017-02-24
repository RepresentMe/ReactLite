import { observable, autorun } from 'mobx';
import axios from 'axios';
import Cookies from 'cookies-js';

class UserStore {

  userData = observable.shallowMap({});
  sessionData = observable.shallowMap({
    authToken: "",
    showUserDialogue: false,
    userLocation: observable.map(),
  });

  constructor() {

    if (Cookies.enabled) { // Check if browser allows cookies and if so attempt auto-login
      let authToken = Cookies.get('representAuthToken'); // Check if cookie exists with authToken
      this.sessionData.set("authToken", authToken);
      this.getMe();
    }

  }

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
          Cookies.set("representAuthToken", response.data.auth_token, { expires: Infinity, domain: 'represent.me' });
          axios.defaults.headers.common['Authorization'] = "Token " + response.data.auth_token;
          this.getMe();
        }
      }.bind(this));
  }

  toggleUserDialogue() {
    this.sessionData.set("showUserDialogue", !this.sessionData.get("showUserDialogue"));
  }

  logout() {
    Cookies.expire("representAuthToken", { domain: 'represent.me' });
    this.sessionData.set("authToken", null);
    this.userData.replace({});
    this.sessionData.set("showUserDialogue", false);
  }

}

export default UserStore;
