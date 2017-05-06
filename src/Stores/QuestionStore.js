import { observable, autorun } from 'mobx';

class QuestionStore {

  questions = observable.shallowMap({});
  searchCache = observable.shallowMap({});

  loadQuestion(id, forceUpdate = false) {
    let self = this;
    return new Promise((resolve, reject) => {

      if (!forceUpdate && self.questions.has(id)) {
        return resolve(self.questions.get(id));
        return
      }

      window.API.get('/api/questions/', {params: { id: id } })
        .then(function (response) {
          if(!response.data.results[0]) {
            return reject("Question not found");
          }
          self.questions.set(response.data.results[0].id, response.data.results[0]);
          return resolve(self.questions.get(response.data.results[0].id))
        }.bind(self));
    })
  }

  getQuestionById(id) {

    return new Promise((resolve, reject) => { // Return a promise of search results
      if(this.questions.has(id)) { // Check cache for results, and instantly resolve if exists
        resolve(this.questions.get(id))
        return;
      }

      window.API.get(`/api/questions/${id}/`)//' + id + '
        .then((response) => {
          if(!response.data) {
            reject("No data")
          }else {
            this.questions.set(response.data.id, response.data);
            resolve(response.data)
          }
        })
        .catch((error) => {
          reject(error)
        })
    });
  }

  searchQuestions(search) {
    return new Promise((resolve, reject) => { // Return a promise of search results
      if(this.searchCache.has(search)) { // Check cache for results, and instantly resolve if exists
        resolve(this.searchCache.get(search))
        return
      }

      window.API.get('/api/questions/', {params: { search, page_size: 3 } })
        .then((response) => {
          let searchResultOutput = []
          if(!response.data.results) {
            reject("No results found")
          }else {
            for(let question of response.data.results) {
              this.questions.set(question.id, question);
              searchResultOutput.push(question.id);
            }
            this.searchCache.set(search, searchResultOutput)
          }
          resolve(searchResultOutput)
        })
        .catch((error) => {
          reject(error)
        })
    });
  }

  voteQuestionLikert(
    questionId, value, collection = null, vote_private = true,
    analytics_os = null, analytics_browser = null,
    analytics_parent_url = null, analytics_location = null) {
    console.log("VOTE LIKERT");
    if(!this.questions.has(questionId) || !value) {
      return false;
    }

    window.API.post('/api/question_votes/', {
        object_id: questionId,
        value,
        collection,
        private: vote_private,
        analytics_interface: 'collection',
        analytics_os,
        analytics_browser,
        analytics_parent_url,
        analytics_location
      })
      .then(function (response) {
        this.loadQuestion(questionId, true);
      }.bind(this));
  }

  voteQuestionMCQ(questionId, value, collection = null, vote_private = true,
    analytics_os = null, analytics_browser = null,
    analytics_location = null, analytics_parent_url = null) {
    console.log("VOTE MCQ");
    if(!this.questions.has(questionId) || !value) {
      return false;
    }

    window.API.post('/api/question_choice_votes/', {
        object_id: questionId,
        value,
        collection,
        private: vote_private,
        analytics_interface: 'collection',
        analytics_os,
        analytics_browser,
        analytics_parent_url,
        analytics_location
      })
      .then(function (response) {
        this.loadQuestion(questionId, true);
      }.bind(this));
  }

  getCollectionItem(collectionId, questionId) {
    return this.collectionItems.values().filter((item) => { return (item.parent === collectionId && item.question === questionId)})[0];
  }

  updateCollectionQuestions(collectionId, newQuestions) {

    let apiQueue = [];

    for(let questionId of newQuestions) { // Loop through questions looking for new questions and updated orders

      let oldIndex = this.collectionQuestions.get(collectionId).indexOf(questionId);
      let newIndex = newQuestions.indexOf(questionId);

      if (oldIndex == -1) { // New question has been added to the collection
        apiQueue.push(window.API.post('/api/question_collection_items/', {
            parent: collectionId,
            question: questionId,
            order: newIndex
          }));
      }else if(oldIndex != newIndex) { // Existing question order has changed
        apiQueue.push(window.API.patch('/api/question_collection_items/' + this.getCollectionItem(collectionId, questionId).id + '/', {
            order: newIndex
          }));
      } // Otherwise the question has not changed
    }

    for(let questionId of this.collectionQuestions.get(collectionId)) { // Loop through existing questions looking for deleted items
      let newIndex = newQuestions.indexOf(questionId);
      if(newIndex == -1) { // Question has been deleted
        apiQueue.push(window.API.delete('/api/question_collection_items/' + this.getCollectionItem(collectionId, questionId).id + '/'));
      }
    }

    window.API.all(apiQueue).then(window.API.spread(function() {
      this.loadCollectionQuestions(collectionId, true);
    }.bind(this)));


  }


}

export default QuestionStore;
