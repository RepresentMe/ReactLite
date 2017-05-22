import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { observable, extendObservable, autorun } from 'mobx';

import DynamicConfigService from '../../services/DynamicConfigService';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import CopyIcon from 'mdi-react/ContentCopyIcon';

@observer
class DynamicConfigEditor extends Component {

  dynamicConfigString = observable('')
  dynamicConfigObj = observable({})
  syrveyId = observable(null)
  helperInputValue = observable('')
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

  copyToClipboard = (id) => {
    let textField = document.getElementById(id)
    textField.select()
    document.execCommand('copy')
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
        {/*<button onClick={() => this.dynamicConfigString.set('')}>Clear</button>*/}
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
        <p style={{fontSize:10}}>
          Labour: 17351 , 
          Conservative: 17663 , 
          Womens Equality: 17667 , 
          Green E&W: 17687 , 
          Plaid:  17689, 
          UKIP:  17710, 
          SNP:  17711, 
          LibDem: 17692 <br /> ALL: <pre>17351,17663,17667,17687,17689,17710,17711,17692</pre>
        </p>
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
      <div>
        <TextField
          hintText="Survey Id"
          floatingLabelText="Survey Id"
          multiLine={true}
          rows={2}
          value={this.syrveyId.get()}
          onChange={(e,v) => this.syrveyId.set(v)}
        />
      </div>
      {this.syrveyId.get() ? (<div>
        <div>
          <IconButton onClick={e => this.copyToClipboard("localhostField")}>
            <CopyIcon />
          </IconButton>
          <TextField
            id="localhostField"
            value={`http://localhost:3000/survey/${this.syrveyId.get()}/${this.dynamicConfigString.get()}`}
            multiLine={true}
            style={{width: '90%'}}
          />
        </div>
        <div>
          <IconButton onClick={e => this.copyToClipboard("stagingField")}>
            <CopyIcon />
          </IconButton>
          <TextField
            id="stagingField"
            value={`https://openv2.represent.me/survey/${this.syrveyId.get()}/${this.dynamicConfigString.get()}`}
            multiLine={true}
            style={{ width: '90%' }}
          />
        </div>
        <div>
          <IconButton onClick={e => this.copyToClipboard("prodField")}>
            <CopyIcon />
          </IconButton>
          <TextField
            id="prodField"
            value={`https://open.represent.me/survey/${this.syrveyId.get()}/${this.dynamicConfigString.get()}`}
            multiLine={true}
            style={{ width: '90%' }}
          />
        </div>
      </div>) : 'Please enter survey ID'}

    </div>)
  }
}

@observer
class UrlResult extends Component {

  hosts = [
    'http://localhost:3000',
    'https://openv2.represent.me',
    'https://open.represent.me',
  ]
  currentHost = observable(window.location.origin)

  handleHostChange = (e,v) => {

  }

  render() {
    return (<div>
      <SelectField
        floatingLabelText="Host"
        value={this.currentHost.get()}
        onChange={this.handleChange}
      >
        <MenuItem value={1} primaryText="Never" />
        <MenuItem value={2} primaryText="Every Night" />
        <MenuItem value={3} primaryText="Weeknights" />
      </SelectField>

      <div>
        <input value={this.helperInputValue.get()} id="helperInput" />
      </div>
    </div>)
  }
}

export default DynamicConfigEditor;