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
        showFollowUserPrompt: false,
        showJoinGroupPrompt: false,
      }
    }
  }

  setConfigFromRaw(rawConfig) {
    try {
      this.config = merge(this.config, JSON.parse(decodeURIComponent(decodeURIComponent(decodeURIComponent(rawConfig)))))
    }catch(e){}
    if(this.config) {
      return true
    }
    return false
  }

  getConfig() {

  }

  getNextRedirect() {
    const lastIndex = this.config.redirects.length -1;
    console.log(this.config.redirects)
    if (this.config.redirects.length === 0 || !this.config.redirects[lastIndex]) {
      return "/"
    } if (this.config.redirects[lastIndex] === "/") {
      return "/" + this.getNextRedirectConfig()
    }else {
      if (this.config.redirects[lastIndex].slice(-1) === "/") {
        return this.config.redirects[lastIndex] + this.getNextRedirectConfig()
      }else {
        return this.config.redirects[lastIndex] + "/" + this.getNextRedirectConfig()
      }
    }
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

    console.log(updated_url)

    this.config.redirects[0] = updated_url
    return this.encodeConfig();
  }

}

export default new DynamicConfigService;
