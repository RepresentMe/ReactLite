import merge from 'deepmerge'

class DynamicConfigService {

  constructor() {
    this.config = {
      survey_end: {
        messenger_prompt: true,
        compare_users: [],
      }
    }
  }

  setConfigFromRaw(rawConfig) {
    this.config = merge(this.config, JSON.parse(decodeURIComponent(rawConfig)))
    if(this.config) {
      return true
    }
    return false
  }

  getConfig() {

  }

}

export default new DynamicConfigService;
