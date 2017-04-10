import { observable, autorun } from 'mobx';

class QuestionStore {

  questions = observable.shallowMap({});
  searchCache = observable.shallowMap({});

  loadQuestion(id, forceUpdate = false) {
    let self = this;
    return new Promise((resolve, reject) => {

      if (!forceUpdate && self.questions.has(id)) {
        return resolve(self.questions.get(id));
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
    if(this.questions.has(id)) {
      return this.questions.get(id);
    }

    return window.API.get('/api/questions/' + id + '/')
        .then((response) => {
          this.questions.set(response.data.id, response.data);
          return response.data;
        })
        .catch((error) => {
          console.log(error);
          return error;
        });
  }

  searchQuestions(search) {
    if(this.searchCache.has(search)) {
      return this.searchCache.get(search);
    }else {
      window.API.get('/api/questions/', {params: { search, page_size: 3 } })
        .then(function (response) {
          if(!response.data.results[0]) {
            return;
          }else {
            let searchResultSummary = [];
            for(let question of response.data.results) {
              if(!this.questions.has(question.id)) {
                this.questions.set(question.id, question);
              }
              searchResultSummary = searchResultSummary.concat([question.id]);
            }
            this.searchCache.set(search, searchResultSummary);
          }
        }.bind(this));
      return false;
    }
  }

  voteQuestionLikert(questionId, value, collection = null) {
    console.log("VOTE LIKERT");
    if(!this.questions.has(questionId) || !value) {
      return false;
    }

    window.API.post('/api/question_votes/', {
        object_id: questionId,
        value,
        collection,
        private: true,
      })
      .then(function (response) {
        this.loadQuestion(questionId, true);
      }.bind(this));
  }

  voteQuestionMCQ(questionId, value, collection = null) {
    console.log("VOTE MCQ");
    if(!this.questions.has(questionId) || !value) {
      return false;
    }

    window.API.post('/api/question_choice_votes/', {
        object_id: value,
        value: 5,
        collection,
        private: true,
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
