import { observable, autorun, computed } from 'mobx';
import Promise from 'promise';

let instance = null;

class QuestionCommentsStore {
  
  comments = observable({
    // 1399: {
    //   page: 1,
    //   page_size: 10,
    //   comments: observable.shallowArray([
    //     {text: }
    //   ])
    // }
  });

  constructor() {

    console.log('QuestionCommentsStore: INIT'); // called only once, so looks like singleton :p
  }

  getComments(id) {
    this.comments[id] = new QuestionComments();
    let params = {
      question: id,
      ordering: '-direct_sum',
      page: 1,
      page_size: 7
    }
    return window.API.get('/api/comments/', {params}).then((res) => {
      // console.log('comments_result', res.data);
      this.comments[id].addComments(res.data.results);
      return res.data;
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
