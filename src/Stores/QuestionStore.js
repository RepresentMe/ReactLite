import { observable, autorun } from 'mobx';
import axios from 'axios';

class QuestionStore {

  questions = observable.shallowMap({});
  collectionQuestions = observable.shallowMap({});

  loadQuestion(id) {

    if(this.questions.has(id)) {
      return;
    }

    axios.get('/api/questions/', {params: { id: id } })
      .then(function (response) {
        console.log("Downloaded question", id);
        this.questions.set(response.data.results[0].id, response.data.results[0]);
      }.bind(this));
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

}

export default QuestionStore;
