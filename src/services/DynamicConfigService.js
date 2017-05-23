import merge from 'deepmerge'

class DynamicConfigService {

  constructor() {
    this.config = {
      redirects: [],
      question_flow: {
        default_public: false,
      },
      survey_end: {
        messenger_prompt: true,
        compare_users: [],
        compare_candidates: [],
        showFollowUser_id: false,
        showJoinGroup_id: false,
      }
    }
  }

  setConfigFromRaw(rawConfig) {
    console.log('setConfigFromRaw', rawConfig);
    try {
      this.config = merge(this.config, JSON.parse(decodeURIComponent(decodeURIComponent(decodeURIComponent(rawConfig)))))
    }catch(e){}
    if(this.config) {
      return true
    }
    return false
  }

  getEncodedConfig() {
    return encodeURIComponent(JSON.stringify(this.config))
  }

  addRedirect(url) {
    this.config.redirects = [url];
  }

  getConfigObjFromStr(str) {
    console.log('getConfigObjFromStr: ', str);
    return JSON.parse(decodeURIComponent(decodeURIComponent(decodeURIComponent(str))));
  }

  setConfigObj(obj) {
    console.log('setConfigObj: ', obj);
    Object.assign(this.config, obj);
  }

  getNextRedirect() {
    console.log('redirects', this.config.redirects);
    let urlToRedirect = null;
    if (this.config.redirects.length === 0) {
      urlToRedirect = "/";
    } else {
      urlToRedirect = this.config.redirects[this.config.redirects.length-1];
      this.config.redirects.splice(-1,1); // remove last
    }
    return urlToRedirect+this.getEncodedConfig();
    // if (this.config.redirects[0] === "/") {
    //   return "/" + this.getNextRedirectConfig()
    // }else {
    //     return this.config.redirects[this.config.redirects.length-1]
    // }
  }

  getNextRedirectConfig() {
    if(this.config.redirects.length === 0) {
      return encodeURIComponent(JSON.stringify(this.config))
    }else {
      let config_clone = JSON.parse(JSON.stringify(this.config))
      config_clone.redirects.shift()
      return encodeURIComponent(JSON.stringify(config_clone))
    }
  }

  encodeConfig(rawConfig) {
    console.log('encodeConfig: ', rawConfig);
    this.config.redirects.push(rawConfig);
    return encodeURIComponent(JSON.stringify(this.config))
  }

  getNextConfigWithRedirect(url) {

    let parts = url.split("/");
    let last_part = parts[parts.length - 1];
    let first_two_chars = last_part.substring(0, 2)
    let updated_url = ""

    if(first_two_chars === "%7" || first_two_chars === "{\"") {
      updated_url = "/"
      parts.shift()
      parts.map((part, index) => {
        if(index !== parts.length-1) {
          updated_url = updated_url + part + "/"
        }
      })
    }else {
      updated_url = url
    }

    this.config.redirects[0] = updated_url
    return this.encodeConfig();
  }



  getDynamicConfig(url) {
    let parts = url.split("/");
    let last_part = parts[parts.length - 1];
    let first_two_chars = last_part.substr(0, 2)
    if (first_two_chars === "%7") {
      return last_part;
    } else if(encodeURIComponent(last_part).substr(0,2) == "%7") {
      return encodeURIComponent(last_part);
    } else {
      return null;
    }
  }

}

export default new DynamicConfigService;
