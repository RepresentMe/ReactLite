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

/* AXIOS CONFIG & MIDDLEWARE */
axios.defaults.baseURL = 'http://localhost:8000';
//axios.defaults.headers.common['Authorization'] = "TEST";
//SEE 'INTERCEPTORS' FOR MIDDLEWARE

injectTapEventPlugin();

ReactDOM.render(
  <Provider
    CollectionStore={new CollectionStore()}
    QuestionStore={new QuestionStore()}
  ><Shell/></Provider>,
  document.getElementById('root')
);
