import { observable, autorun, computed } from 'mobx';
import Promise from 'promise';

const instance = null;

class QuestionCommentsStore {
  
  comments = observable.shallowMap({
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
    const params = {
      question: id,
      ordering: '-direct_sum',
      page: 1,
      page_size: 7
    }
    window.API.get('/api/comments/', {params}).then((res) => {
      console.log('comments_result', res);
    })
  }

  createComment(comment) {
    console.log('createComment')
    window.API.post('/api/comments/', comment).then((res) => {
      console.log('create_comment', res);
    })
  }

}

// export default instance ? instance : instance = new QuestionCommentsStore();
export default QuestionCommentsStore;
