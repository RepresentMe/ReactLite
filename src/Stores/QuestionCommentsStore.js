import { observable, autorun, computed } from 'mobx';
import Promise from 'promise';

const instance = null;

class QuestionCommentsStore {
  
  questionToComments = observable({
    // 1399: {
    //   page: 1,
    //   page_size: 10,
    //   comments: observable.shallowArray([
    //     {text: }
    //   ])
    // }
  });

  constructor() {
  }

  getComments(id) {
    this.questionToComments[id] = new QuestionComments();
    const params = {
      question: id,
      ordering: 'created_at',
      page: 1,
      page_size: 7
    }
    return window.API.get('/api/comments/', {params}).then((res) => {
      this.questionToComments[id].addComments(res.data.results);
      return res.data;
    })
  }


  createComment(comment) {
    return new Promise((resolve, reject) => {
      window.API.post('/api/comments/', comment)
        .then((res) => {
          console.log(res)
          this.questionToComments[comment.question].addComments([res.data])
          resolve()
        })
        .catch(err => reject(err))
    })
  }

  deleteComment(comment) {
    return window.API.delete(`/api/comments/${comment.id}/`)
      .then((res) => {
        return this.questionToComments[comment.question].comments.remove(comment)
      })
  }

}


class QuestionComments {
  page: 1
  page_size: 7
  comments = observable.shallowArray([])
  constructor(comments = []) {
    this.addComments(comments)
  }

  addComments(comments) {
    this.comments.replace(this.comments.concat(comments));
  }
}

// export default instance ? instance : instance = new QuestionCommentsStore();
export default QuestionCommentsStore;
