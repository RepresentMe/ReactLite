import { observable, autorun, observe } from 'mobx';
import Cookies from 'cookies-js';
import GeoService from '../services/GeoService'

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
    return new Promise((resolve, reject) => {
      if(!this.sessionData.get("authToken")) {
        reject("No auth token");
      }

      window.API.get('/auth/me/')
        .then((response) => {
          this.userData.replace(response.data);
          resolve(response.data);
        })
        .catch((error) => {
          reject(error)
        })
    });

  }

  setupAuthToken(authToken) {
    return new Promise((resolve, reject) => {
      this.sessionData.set("authToken", authToken);
      Cookies.set("representAuthToken", authToken, { expires: Infinity });
      window.API.defaults.headers.common['Authorization'] = "Token " + authToken;
      this.getMe()
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    });
  }

  getAuthToken() {
    return this.sessionData.get("authToken") || false;
  }

  authYeti(provider, access_token) {
    window.API.post('/auth-yeti/', { provider, access_token })
      .then(function (response) {
        if(response.data.auth_token && response.data.id) {
          this.setupAuthToken(response.data.auth_token);
        }
      }.bind(this));
  }

  facebookLogin(access_token) {
    return new Promise((resolve, reject) => {

      window.API.post('/auth/social_auth/', {provider: 'facebook', access_token})
        .then((response) => {
          try {
            this.setupAuthToken(response.data.auth_token);
          } catch(e) {
            reject(e)
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
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

    return new Promise((resolve, reject) => { // Return a promise of search results

      if(details.postcode) {
        GeoService.checkPostcode(details.postcode)
          .then((response) => {

            if(response.data.status === "OK") {
              let raw_location = response.data.results[0].geometry.location;
              location =  {
                "type": "Point",
                "coordinates": [raw_location.lng, raw_location.lat]
              };
            }

          })

      }

    })

  }


  logout() {
    Cookies.expire("representAuthToken");
    this.sessionData.set("authToken", "");
    this.userData.replace({});
    this.sessionData.set("showUserDialogue", false);
    location.reload();
  }

  isLoggedIn() {
    return this.userData.has("id");
  }

  compareUsers(userAId, userBId) {
    return window.API.get('/api/compare_users/?usera='+userAId+'&userb='+userBId)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error, error.response.data);
      });
  }

  getUserById(id) {
    return window.API.get('/api/users/' + id + '/')
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error, error.response.data);
      });
  }

  checkEmail(email) {

    return new Promise((resolve, reject) => { // Return a promise of search results
      window.API.get('/auth/check_email/?email=' + email)
        .then((response) => {
          resolve(response.data.result)
        })
        .catch((error) => {
          console.log(error)
        })
      })
  }

  checkEmailRegex(email) {
    if(!RegExp("[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?").test(email)) {
      return false
    }
    return true
  }

  // to find out if I (logged user) am following other user
  amFollowingUser(myId, theirId) {
    return window.API.get(`/api/following_users/?user=${myId}&following=${theirId}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error, error.response.data);
      });
  }

  //to set that  (logged user) follow other user
  setFollowing(theirId) {
    return window.API.post(`/api/following_users/`, {following: theirId})
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error, error.response.data);
      });
    }

  //to delete the following object that I (logged user) follow other user
  removeFollowing(followId) {
    return window.API.delete(`/api/following_users/${followId}`)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error, error.response.data);
      });
    }

  
  isUserDataComplete(){
    let userData = this.userData;
    return userData;
  }


  } //end of UserStore


autorun(() => {
  //window.API.defaults.headers.common['Authorization'] = "Token ff76bcf5e0daf737144f34fcd913a6cd13c96df2";
})

export default UserStore;
