import { observable, autorun, computed } from 'mobx';
import axios from 'axios';
import Promise from 'promise';

class CollectionStore {

  collections = observable.shallowMap([]);
  collectionItems = observable.shallowMap({});
  searchCache = observable.shallowMap({});

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

  items(collectionId, forceUpdate = false) {

    if(!forceUpdate && this.collectionItems.has(collectionId)) {
      return this.collectionItems.get(collectionId);
    }

    axios.get('/api/question_collection_items/', {params: { parent: collectionId, ordering: 'order' } })
      .then(function (response) { // Then perform network requests to get questions
        let items = response.data.results;
        for(let item of items) {
          if(item.type === 'Q') { // If item is a question, update QuestionStore
            window.stores.QuestionStore.questions.set(item.content_object.id, item.content_object); // Add question to QuestionStore
            delete item.content_object; // Remove the question data as now stored in QuestionStore
          }
        }
        if(items.length === 0) {
          this.collectionItems.set(collectionId, []);
        } else {
          this.collectionItems.set(collectionId, items);
        }
      }.bind(this));

    return null;

  }

  searchCollections(search) {
    if(this.searchCache.has(search)) {
      return this.searchCache.get(search);
    }else {
      axios.get('/api/question_collections/', {params: { search, page_size: 3 } })
        .then(function (response) {
          if(!response.data.results[0]) {
            return;
          }else {
            let searchResultSummary = [];
            for(let collection of response.data.results) {
              if(!this.collections.has(collection.id)) {
                this.collections.set(collection.id, collection);
              }
              searchResultSummary = searchResultSummary.concat([collection.id]);
            }
            this.searchCache.set(search, searchResultSummary);
          }
        }.bind(this));
      return false;
    }
  }

  createCollection(title, description, endText, questions) {

    return new Promise(function (fulfill, reject){

      if(questions.length <= 0) {
        reject("Please add at least one question to create a collection");
        return;
      }

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
                  fulfill(response.data.id);
                });
            }
          }
        }.bind(this));

      }.bind(this));
  }

  updateCollection(collectionId, title, description, endText) {
    axios.patch('/api/question_collections/' + collectionId + '/', { // First step is update details
        desc: description,
        end_text: endText,
        name: title,
      }).then(function (response) { // Once details updated, check for question changes
        this.getCollection(collectionId, true);
      }.bind(this));
  }

}

export default CollectionStore;
