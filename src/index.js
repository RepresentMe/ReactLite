import React from 'react';
import ReactDOM from 'react-dom';
import Shell from './components/Shell';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';

/* STORES */
import UserStore from './Stores/UserStore.js';
import CollectionStore from './Stores/CollectionStore.js';
import QuestionStore from './Stores/QuestionStore.js';
import DemographicsDataStore from './Stores/DemographicsDataStore.js';
import AppStatisticsStore from './Stores/AppStatisticsStore.js';

/* AXIOS CONFIG & MIDDLEWARE */
axios.defaults.baseURL = 'http://localhost:8000';
//SEE 'INTERCEPTORS' FOR MIDDLEWARE

injectTapEventPlugin();

window.stores = {
  UserStore:              new UserStore(),
  CollectionStore:        new CollectionStore(),
  QuestionStore:          new QuestionStore(),
  DemographicsDataStore:  new DemographicsDataStore(),
  AppStatisticsStore:     new AppStatisticsStore(),
}

ReactDOM.render(
  <Provider
    UserStore={window.stores.UserStore}
    CollectionStore={window.stores.CollectionStore}
    QuestionStore={window.stores.QuestionStore}
    DemographicsDataStore={window.stores.DemographicsDataStore}
    AppStatisticsStore={window.stores.AppStatisticsStore}
  ><Shell/></Provider>,
  document.getElementById('root')
);
