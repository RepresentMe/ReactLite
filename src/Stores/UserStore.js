import { observable, autorun, observe } from 'mobx';
import axios from 'axios';
import Cookies from 'cookies-js';

class UserStore {

  userData = observable.shallowMap({});
  sessionData = observable.shallowMap({
    authToken: "",
    showUserDialogue: false,
  });

  userLocation = observable.shallowMap({
    pathname: window.location.pathname
  });

  updateAxios = observe(this.sessionData, "authToken", (change) => {
    if(change.newValue) {
      axios.defaults.headers.common['Authorization'] = "Token " + change.newValue;
    }else {
      delete axios.defaults.headers.common['Authorization'];
    }
  });

  constructor() {

    if (Cookies.enabled) { // Check if browser allows cookies and if so attempt auto-login
      let authToken = Cookies.get('representAuthToken'); // Check if cookie exists with authToken
      this.sessionData.set("authToken", authToken);
      this.getMe();
    }

    axios.interceptors.response.use(function (response) { // On successful response
        return response;
      }, function (error) { // On error response
        if(401 === error.response.status) { // Server returned 401
          console.log("Logging out");
          this.logout();
        }
        return Promise.reject(error);
      }.bind(this));

  }

  getMe() {
    if(!this.sessionData.get("authToken")) {
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
          Cookies.set("representAuthToken", response.data.auth_token, { expires: Infinity });
          axios.defaults.headers.common['Authorization'] = "Token " + response.data.auth_token;
          this.getMe();
        }
      }.bind(this));
  }

  toggleUserDialogue() {
    this.sessionData.set("showUserDialogue", !this.sessionData.get("showUserDialogue"));
  }

  logout() {
    Cookies.expire("representAuthToken");
    this.sessionData.set("authToken", "");
    this.userData.replace({});
    this.sessionData.set("showUserDialogue", false);
    location.reload();
  }

}

autorun(() => {
  //axios.defaults.headers.common['Authorization'] = "Token ff76bcf5e0daf737144f34fcd913a6cd13c96df2";
})

export default UserStore;
