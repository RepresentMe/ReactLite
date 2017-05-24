import { observable, autorun, computed } from 'mobx';
import Promise from 'promise';

class CollectionStore {

  collections = observable.shallowMap([]);
  collectionItems = observable.shallowMap({});
  searchCache = observable.shallowMap({});
  //next = observable.shallowObject({values: null});


  constructor() {

    window.API.get('/api/question_collections/')
      .then(function (response) {
        for (let collection of response.data.results) {
          this.collections.set(collection.id, collection);
        }
      }.bind(this))
      .catch(function(error) {
        console.log(error, error.response.data);
      });

  }

  getCollection(collectionId, forceUpdate = false) {

    if(!forceUpdate && this.collections.has(collectionId)) {
      return true;
    }

    return window.API.get('/api/question_collections/', {params: {id: collectionId}})
      .then(function (response) {
        this.collections.set(response.data.results[0].id, response.data.results[0]);
      }.bind(this));
  }

  getCollectionById(collectionId) {
    return new Promise((resolve, reject) => { // Return a promise of search results
      if(this.collections.has(collectionId)) { // Check cache for results, and instantly resolve if exists
        resolve(this.collections.get(collectionId))
        return
      }

      window.API.get('/api/question_collections/' + collectionId + '/')
        .then((response) => {
          if(!response.data) {
            reject("No data")
          }else {
            this.collections.set(collectionId, response.data);
            resolve(response.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    });
  }

  getCollectionItemsById(collectionId) {
    return new Promise((resolve, reject) => { // Return a promise of search results
      if(this.collectionItems.has(collectionId)) { // Check cache for results, and instantly resolve if exists
        resolve(this.collectionItems.get(collectionId))
        return
      }

      this.getCollectionItemsByIdPage(collectionId, 1)
        .then((response) => {
          let items = response
          for(let item of items) {
            if(item.type === 'Q') { // If item is a question, update QuestionStore
              window.stores.QuestionStore.questions.set(item.content_object.id, item.content_object); // Add question to QuestionStore
              delete item.content_object; // Remove the question data as now stored in QuestionStore
            }
          }
          this.collectionItems.set(collectionId, items);
          resolve(items)
        })
        .catch((error) => {
          reject(error)
        })
    });
  }

  getCollectionItemsByIdPage(collectionId, page) {
    return new Promise((resolve, reject) => {
      window.API.get('/api/question_collection_items/', {params: { parent: collectionId, ordering: 'order', page } })
        .then((response) => {
          let items = response.data.results;
          const count = Math.ceil(response.data.count / 10);

          if(items.length < 10 || page === count) {
            resolve(items)
          } else {
            this.getCollectionItemsByIdPage(collectionId, page + 1)
              .then((inner_items) => {
                resolve(items.concat(inner_items))
              })
              .catch((error) => {
                reject(error)
              })
              }
        })
        .catch((error) => {
          resolve([])
        })
    })
  }

  setCollectionQuestionById = ({parent, object_id, type, content_object}) => {
    return new Promise((resolve, reject) => { // Return a promise of search results

    window.API.post(`/api/question_collection_items/`, { parent, object_id, type, content_object  })
      .then((response) => {
        let item = response.data;
        if(item.type === 'Q') { // If item is a question, update QuestionStore
          window.stores.QuestionStore.questions.set(item.content_object.id, item.content_object); // Add question to QuestionStore
          delete item.content_object; // Remove the question data as now stored in QuestionStore



          let items = this.collectionItems.get(parent);
          items.unshift(item);
          this.collectionItems.set(parent, items);

          resolve(items)
        }
      }).catch((error) => {
        reject(error)
      })
    })
  }

  // EV's version - page by page
  // getCollectionItemsById(collectionId) {
  //   return new Promise((resolve, reject) => { // Return a promise of search results
  //     // Check cache for results, and instantly resolve if exists
  //     // initially, when next.values is null
  //     if(this.collectionItems.has(collectionId) && this.next.values === null) {
  //       console.log('resolving')
  //       resolve(this.collectionItems.get(collectionId))
  //       return
  //     }
  //
  //     //First loop - fetches 1st 10 questions
  //     if (this.next.values === null){
  //       window.API.get('/api/question_collection_items/', {params: { parent: collectionId, ordering: 'order' } })
  //         .then((response) => {
  //           console.log('response',response)
  //           if(!response.data) {
  //             reject("No data")
  //           } else {
  //             let items = response.data.results;
  //             let nextString = response.data.next;
  //             let index = nextString.indexOf('page=') + 5;
  //             this.next.values = nextString.slice(index, index + 1) ;
  //
  //             console.log('this.next.values (first 10)', this.next.values)
  //             for(let item of items) {
  //               if(item.type === 'Q') { // If item is a question, update QuestionStore
  //                 window.stores.QuestionStore.questions.set(item.content_object.id, item.content_object); // Add question to QuestionStore
  //                 delete item.content_object; // Remove the question data as now stored in QuestionStore
  //               }
  //             }
  //             this.collectionItems.set(collectionId, response.data.results);
  //             resolve(response.data.results)
  //           }
  //         })
  //         .catch((error) => {
  //           reject(error)
  //         })
  //       }
  //       //Next loops to fetch new portion of questions
  //       else {
  //         console.log('fetching next portion of questions')
  //         window.API.get('/api/question_collection_items/?page='+ this.next.values) //, {params: { parent: collectionId,  page: this.next.values, ordering: 'order' } })
  //           .then((response) => {
  //             console.log('response2', response)
  //             if(!response.data) {
  //               reject("No data")
  //             } else {
  //               let items = response.data.results;
  //               let nextString = response.data.next;
  //               let index = nextString.indexOf('page=') + 5;
  //               this.next.values = nextString.slice(index, index + 1) ;
  //
  //
  //               for(let item of items) {
  //                 if(item.type === 'Q') { // If item is a question, update QuestionStore
  //                   window.stores.QuestionStore.questions.set(item.content_object.id, item.content_object); // Add question to QuestionStore
  //                   delete item.content_object; // Remove the question data as now stored in QuestionStore
  //                 }
  //               }
  //               //EV: initial code: this.collectionItems.set(collectionId, response.data.results);
  //               const updatedCollectionItems = [...this.collectionItems.values()[0], ...response.data.results]
  //               this.collectionItems.set(collectionId, updatedCollectionItems);
  //               console.log('this.next.values - next loop No:', this.next.values)
  //               console.log('this.collectionItems from COLLECTION',this.collectionItems)
  //               console.log('this.collectionItems from COLLECTION value',this.collectionItems.values()[0])
  //               resolve(response.data.results)
  //             }
  //           })
  //           .catch((error) => {
  //             reject(error)
  //           })
  //       }
  //   });
  // }

  items(collectionId, forceUpdate = false) {

    if(!forceUpdate && this.collectionItems.has(collectionId)) {
      return this.collectionItems.get(collectionId);
    }

    window.API.get('/api/question_collection_items/', {params: { parent: collectionId, ordering: 'order' } })
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
          console.log('this.collectionItems from ITEMS',this.collectionItems)
        }
      }.bind(this))
      .catch(function(error) {
        console.log(error, error.response.data);
      });

    return null;

  }

  searchCollections(search) {
    if(this.searchCache.has(search)) {
      return this.searchCache.get(search);
    }else {
      window.API.get('/api/question_collections/', {params: { search, page_size: 3 } })
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
        }.bind(this))
        .catch(function(error) {
          console.log(error, error.response.data);
        });
      return false;
    }
  }

  createCollection(title, description, endText, questions) {

    return new Promise(function (fulfill, reject){

      if(questions.length <= 0) {
        reject("Please add at least one question to create a collection");
        return;
      }

      window.API.post('/api/question_collections/', {
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
              window.API.post('/api/question_collection_items/', {
                  parent: response.data.id,
                  question: questionId,
                }).then(function (responseQuestion) {
                  fulfill(response.data.id);
                });
            }
          }
        }.bind(this))
        .catch(function(error) {
          console.log(error, error.response.data);
        });

      }.bind(this));
  }

  updateCollection(collectionId, title, description, endText) {
    window.API.patch('/api/question_collections/' + collectionId + '/', { // First step is update details
        desc: description,
        end_text: endText,
        name: title,
      }).then(function (response) { // Once details updated, check for question changes
        this.getCollection(collectionId, true);
      }.bind(this))
      .catch(function(error) {
        console.log(error, error.response.data);
      });
  }

  updateCollectionItems(collectionId, newItems) {
    this.getCollectionItemsById(collectionId).then((oldItems) => {
      let itemsToDelete = [];
      let itemsToPatch = [];
      for (var i = 0; i < oldItems.length; i++) {
        let shouldDelete = true;
        for (var j = 0; j < newItems.length; j++) {
          if(oldItems[i].id == newItems[j].id) {
            if(oldItems[i].order != j) {
              newItems[j].order = j;
              itemsToPatch.push(newItems[j])
            }
            shouldDelete = false;
            break;
          }        
        }
        if(shouldDelete) itemsToDelete.push(oldItems[i])  
      }

      let queue = itemsToPatch.map((item) => window.API.patch(`/api/question_collection_items/${item.id}/`, { order: item.order, type: item.type, object_id: item.object_id, content_object: null, parent:item.parent }))
      queue = queue.concat(itemsToDelete.map((item) => window.API.delete(`/api/question_collection_items/${item.id}/`)))

      window.API.all(queue).then(window.API.spread(function() {
      }.bind(this)));
    })
    // return window.API.patch(`/api/question_collection_items/${collectionItem.id}/`, collectionItem)
  }

}

export default CollectionStore;
