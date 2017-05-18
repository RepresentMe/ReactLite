import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, extendObservable, autorun } from 'mobx';

import DynamicConfigService from '../../services/DynamicConfigService';
import TextField from 'material-ui/TextField';

@observer
class DynamicConfigEditor extends Component {

  dynamicConfigString = observable('')
  dynamicConfigObj = observable({})
  isInFocus = {
    joinGroup: observable(false),
    followUser: observable(false)
  }
  constructor(props) {
    super(props);

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(props.match.params.dynamicConfig)
    }
    extendObservable(this.dynamicConfigObj, this.dynamicConfig.config)

    autorun(() => {
      this.dynamicConfigObj.survey_end.compare_users;
      this.dynamicConfigObj.survey_end.showJoinGroup_id;
      this.dynamicConfigObj.survey_end.showFollowUser_id;
      this.saveToString();
    })
  }

  onDynamicConfigChange =(e,value) => {
    this.dynamicConfigString.set(value);
    extendObservable(this.dynamicConfigObj, JSON.parse(decodeURIComponent(decodeURIComponent(decodeURIComponent(value)))))
  }
  
  saveToString = () => {
    this.dynamicConfigString.set(
      encodeURIComponent(
        encodeURIComponent(
          JSON.stringify(this.dynamicConfigObj)
        )
      )
    )
  }

  setCompareUsersValue = (v) => {
    v = this.replaceAll(v, ' ', '');
    this.dynamicConfigObj.survey_end.compare_users = v.split(',');
  }

  setJoinGrouprValue = (v) => {
    v = this.replaceAll(v, ' ', '');
    this.dynamicConfigObj.survey_end.showJoinGroup_id = (v || this.isInFocus.joinGroup.get()) ? v : false
  }
  setFollowUserValue = (v) => {
    v = this.replaceAll(v, ' ', '');
    this.dynamicConfigObj.survey_end.showFollowUser_id = (v || this.isInFocus.followUser.get()) ? v : false
  }

  replaceAll = function(str, search, replacement) {
      return str.split(search).join(replacement);
  };

  render() {
    return (<div style={{margin: 30}}>
      <div>
        <TextField
          hintText="Encoded Dynamic config"
          floatingLabelText="Encoded Dynamic config"
          multiLine={true}
          rows={3}
          fullWidth={true}
          value={this.dynamicConfigString.get()}
          onChange={this.onDynamicConfigChange}
        />
        <button onClick={() => this.dynamicConfigString.set('')}>Clear</button>
      </div>

      <div>
        <TextField
          hintText="Compare users"
          floatingLabelText="Users(separate by comma)"
          multiLine={true}
          rows={2}
          onBlur={() => {
            this.dynamicConfigObj.survey_end.compare_users.replace(this.dynamicConfigObj.survey_end.compare_users.filter((user) => {
              return !!user; // filter out empty strings
            }))
          }}
          value={this.dynamicConfigObj.survey_end.compare_users}
          onChange={(e,v) => this.setCompareUsersValue(v)}
        />
        <TextField
          hintText="Join group"
          floatingLabelText="Join group"
          multiLine={true}
          rows={2}
          value={this.dynamicConfigObj.survey_end.showJoinGroup_id}
          onFocus={ () => {
            this.isInFocus.joinGroup.set(true);
            this.dynamicConfigObj.survey_end.showJoinGroup_id = this.dynamicConfigObj.survey_end.showJoinGroup_id ? this.dynamicConfigObj.survey_end.showJoinGroup_id : '';
          }}
          onBlur={() => {
            this.isInFocus.joinGroup.set(false);
            if(!this.dynamicConfigObj.survey_end.showJoinGroup_id) this.dynamicConfigObj.survey_end.showJoinGroup_id = false;
          }}
          onChange={(e,v) => this.setJoinGrouprValue(v)}
        />
        <TextField
          hintText="Follow user"
          floatingLabelText="Follow user"
          multiLine={true}
          rows={2}
          value={this.dynamicConfigObj.survey_end.showFollowUser_id}
          onFocus={ () => {
            this.isInFocus.followUser.set(true);
            this.dynamicConfigObj.survey_end.showFollowUser_id = this.dynamicConfigObj.survey_end.showFollowUser_id ? this.dynamicConfigObj.survey_end.showFollowUser_id : '';
          }}
          onBlur={() => {
            this.isInFocus.followUser.set(false);
            if(!this.dynamicConfigObj.survey_end.showFollowUser_id) this.dynamicConfigObj.survey_end.showFollowUser_id = false;
          }}
          onChange={(e,v) => this.setFollowUserValue(v)}
        />
      </div>
    </div>)
  }
}

export default DynamicConfigEditor;