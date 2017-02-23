import { observable, autorun } from 'mobx';
import axios from 'axios';

class CollectionStore {

  collections = observable.shallowMap([]);

  constructor() {
    axios.get('/api/question_collections/')
      .then(function (response) {
        for (let collection of response.data.results) {
          this.collections.set(collection.id, collection);
        }
      }.bind(this));
  }

}

export default CollectionStore;
