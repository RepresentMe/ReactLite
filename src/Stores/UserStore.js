import { observable, autorun, observe } from 'mobx';
import Cookies from 'cookies-js';

class UserStore {

  userData = observable.shallowMap({});
  sessionData = observable.shallowMap({
    authToken: "",
    showUserDialog: false,
  });

  userLocation = observable.shallowMap({
    pathname: window.location.pathname
  });

  updateAxios = observe(this.sessionData, "authToken", (change) => {
    if(change.newValue) {
      window.API.defaults.headers.common['Authorization'] = "Token " + change.newValue;
    }else {
      delete window.API.defaults.headers.common['Authorization'];
    }
  });

  constructor() {

    if (Cookies.enabled) { // Check if browser allows cookies and if so attempt auto-login
      let authToken = Cookies.get('representAuthToken'); // Check if cookie exists with authToken
      this.sessionData.set("authToken", authToken);
      this.getMe();
    }

    window.API.interceptors.response.use(function (response) { // On successful response
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

    window.API.get('/auth/me/')
      .then(function (response) {
        this.userData.replace(response.data);
      }.bind(this));

  }

  setupAuthToken(authToken) {
    this.sessionData.set("authToken", authToken);
    Cookies.set("representAuthToken", authToken, { expires: Infinity });
    window.API.defaults.headers.common['Authorization'] = "Token " + authToken;
    this.getMe();
  }

  authYeti(provider, access_token) {
    window.API.post('/auth-yeti/', { provider, access_token })
      .then(function (response) {
        if(response.data.auth_token && response.data.id) {
          this.setupAuthToken(response.data.auth_token);
        }
      }.bind(this));
  }

  authLogin(username, password) {
    return window.API.post('/auth/login/', { username, password })
      .then(function (response) {
        if(response.data.auth_token) {
          this.setupAuthToken(response.data.auth_token);
        }
      }.bind(this));
  }

  toggleUserDialog() {
    this.sessionData.set("showUserDialog", !this.sessionData.get("showUserDialog"));
  }

  register(details) {
    return window.API.post('/auth-yeti/', details);
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
  //window.API.defaults.headers.common['Authorization'] = "Token ff76bcf5e0daf737144f34fcd913a6cd13c96df2";
})

export default UserStore;
