import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/Shell';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';

/* STORES */
import CollectionStore from './Stores/CollectionStore.js';
import QuestionStore from './Stores/QuestionStore.js';
import UserStore from './Stores/UserStore.js';
import DemographicsDataStore from './Stores/DemographicsDataStore.js';
import AppStatisticsStore from './Stores/AppStatisticsStore.js';

/* AXIOS CONFIG & MIDDLEWARE */
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.headers.common['Authorization'] = "Token ff76bcf5e0daf737144f34fcd913a6cd13c96df2";
//SEE 'INTERCEPTORS' FOR MIDDLEWARE

injectTapEventPlugin();

ReactDOM.render(
  <Provider
    CollectionStore={new CollectionStore()}
    QuestionStore={new QuestionStore()}
    UserStore={new UserStore()}
    DemographicsDataStore={new DemographicsDataStore()}
    AppStatisticsStore={new AppStatisticsStore()}
  ><Shell/></Provider>,
  document.getElementById('root')
);
