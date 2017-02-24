import { observable, autorun } from 'mobx';
import axios from 'axios';

class QuestionStore {

  questions = observable.shallowMap({});
  collectionQuestions = observable.shallowMap({});
  searchCache = observable.shallowMap({});

  loadQuestion(id, forceUpdate = false) {

    if(!forceUpdate && this.questions.has(id)) {
      return true;
    }

    axios.get('/api/questions/', {params: { id: id } })
      .then(function (response) {
        if(!response.data.results[0]) {
          return;
        }
        console.log("Downloaded question", id);
        this.questions.set(response.data.results[0].id, response.data.results[0]);
      }.bind(this));
  }

  searchQuestions(search) {
    if(this.searchCache.has(search)) {
      return this.searchCache.get(search);
    }else {
      axios.get('/api/questions/', {params: { search, page_size: 3 } })
        .then(function (response) {
          if(!response.data.results[0]) {
            return;
          }else {
            let searchResultSummary = [];
            for(let question of response.data.results) {
              if(!this.questions.has(question.id)) {
                this.questions.set(question.id, question);
                console.log("Downloaded question", question.id);
              }
              searchResultSummary = searchResultSummary.concat([question.id]);
            }
            this.searchCache.set(search, searchResultSummary);
          }
        }.bind(this));
      return false;
    }
  }

  loadCollectionQuestions(collectionId) {

    if(this.collectionQuestions.has(collectionId)) {
      return;
    }

    axios.get('/api/question_collection_items/', {params: { parent: collectionId, ordering: 'order' } })
      .then(function (response) {
        // Add questions and add question collection relationship
        let questionIds = [];
        for (let question of response.data.results) {
          this.loadQuestion(question.question);
          questionIds.push(question.question);
        }
        this.collectionQuestions.set(collectionId, questionIds);
      }.bind(this));

  }

  voteQuestion(questionId, value) {
    if(!this.questions.has(questionId) || !value) {
      return false;
    }

    axios.post('/api/question_votes/', {
        object_id: questionId,
        value,
        private: true,
      })
      .then(function (response) {
        this.loadQuestion(questionId, true);
      }.bind(this));
  }


}

export default QuestionStore;
