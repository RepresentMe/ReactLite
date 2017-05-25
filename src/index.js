import React from 'react';
import ReactDOM from 'react-dom';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import Shell from './components/Shell';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'mobx-react';
import { observable } from 'mobx';
import axios from 'axios';
import DevTools, { setLogEnabled } from 'mobx-react-devtools';
import createHistory from 'history/createBrowserHistory'
import createMemoryHistory from 'history/createMemoryHistory'


/* STORES */
import UserStore from './Stores/UserStore.js';
import CollectionStore from './Stores/CollectionStore.js';
import QuestionStore from './Stores/QuestionStore.js';
import DemographicsDataStore from './Stores/DemographicsDataStore.js';
import CensusDataStore from './Stores/CensusDataStore.js';
import AppStatisticsStore from './Stores/AppStatisticsStore.js';
import QuestionCommentsStore from './Stores/QuestionCommentsStore.js';
import UrlPreviewStore from './Stores/UrlPreviewStore.js';
import GroupStore from './Stores/GroupStore.js';
import ReactGA from 'react-ga';

injectTapEventPlugin();

const breakpoints = observable({
  xs: '(max-width: 767px)',
  su: '(min-width: 768px)',
  sm: '(min-width: 768px) and (max-width: 991px)',
  md: '(min-width: 992px) and (max-width: 1199px)',
  mu: '(min-width: 992px)',
  lg: '(min-width: 1200px)',
});

ReactGA.initialize('UA-59994709-1', {
  debug: false,
  titleCase: false
});


window.authSettings = {
  facebookPageId: 1522822621304793,
  //facebookId: 1499361770335561,
  facebookId: 1499361770335561,
  googleMapsAPI: "AIzaSyDZxI6243Bb460yabWL_tyN97NBH6hsnwo",
}

if (location.host === 'open.represent.me') { // Test server override defaults
  window.authSettings.facebookId = 1499361770335561;
  window.API = axios.create({
    baseURL: 'https://api.represent.me'
  });
}else
// if (location.host === 'share-test.represent.me' || location.host === 'test.represent.me' || location.host === 'open.represent.me' || location.host === 'openv2.represent.me')
{ // Test server override defaults
  window.authSettings.facebookId = 1684727181799018;
  window.API = axios.create({
    baseURL: 'https://staging.represent.me'
  });
}
// else {
//   window.API = axios.create({
//     baseURL: 'http://localhost:8000'
//     //baseURL: 'http://api.represent.me'
//   });
//   window.authSettings.facebookId = 1665890767015993;
// }

window.stores = {
  UserStore:              new UserStore(),
  CollectionStore:        new CollectionStore(),
  QuestionStore:          new QuestionStore(),
  DemographicsDataStore:  new DemographicsDataStore(),
  CensusDataStore:        new CensusDataStore(),
  AppStatisticsStore:     new AppStatisticsStore(),
  QuestionCommentsStore:     new QuestionCommentsStore(),
  UrlPreviewStore:     new UrlPreviewStore(),
  GroupStore:     new GroupStore(),
  RoutingStore: new RouterStore()
}

window.fbAsyncInit = () => {
  let fb = window.FB;
  if (fb) {
    fb.getLoginStatus(function(response) {
      if (response.status === 'connected') {    
        window.stores.UserStore.loggedFB.set(true);
      }
    })
  }
};

window.REPRESENT = (element, initialPath = "/", virtualLocation = true) => {

  let history;

  if(virtualLocation) {
    history = createMemoryHistory({
      initialEntries: [ initialPath ],
    });
  }else {
    history = createHistory();
      history.listen((location, action) => {
        //console.log('location, action', location, action)
        ReactGA.set({ page: location.pathname });
        ReactGA.pageview(location.pathname);
      }
    );
  }
  history = syncHistoryWithStore(history, window.stores.RoutingStore);

  ReactDOM.render(
    <div>
      <Provider
        UserStore={window.stores.UserStore}
        CollectionStore={window.stores.CollectionStore}
        QuestionStore={window.stores.QuestionStore}
        DemographicsDataStore={window.stores.DemographicsDataStore}
        CensusDataStore={window.stores.CensusDataStore}
        AppStatisticsStore={window.stores.AppStatisticsStore}
        QuestionCommentsStore={window.stores.QuestionCommentsStore}
        UrlPreviewStore={window.stores.UrlPreviewStore}
        GroupStore={window.stores.GroupStore}
        RoutingStore={window.stores.RoutingStore}
        >
        <Shell history={history}/>
      </Provider>
    </div>,
    document.getElementById(element)
  );
}

window.REPRESENTREADY();
