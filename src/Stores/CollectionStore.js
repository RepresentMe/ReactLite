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

  getCollection(collectionId, forceUpdate = false) {

    if(!forceUpdate && this.collections.has(collectionId)) {
      return true;
    }

    axios.get('/api/question_collections/', {params: {id: collectionId}})
      .then(function (response) {
        this.collections.set(response.data.results[0].id, response.data.results[0]);
      }.bind(this));
  }

  createCollection(title, description, endText, questions) {
    axios.post('/api/question_collections/', {
        desc: description,
        end_text: endText,
        name: title,
      })
      .then(function (response) {
        if(response.data.id) {
          this.collections.set(response.data.id, response.data);
          if(!questions) {
            return;
          }
          for(let questionId of questions) {
            axios.post('/api/question_collection_items/', {
                parent: response.data.id,
                question: questionId,
              }).then(function (responseQuestion) {
              });
          }
        }
      }.bind(this));
  }

}

export default CollectionStore;
