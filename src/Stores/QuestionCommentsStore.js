import { observable, autorun, computed } from 'mobx';
import Promise from 'promise';

let instance = null;

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

  getComments() {
    let params = {
      question: 1050,
      ordering: '-direct_sum',
      page: 1,
      page_size: 7
    }
    window.API.get('/api/comments/', {params}).then((res) => {
      console.log('comments_result', res);
    })
  }

}

// export default instance ? instance : instance = new QuestionCommentsStore();
export default QuestionCommentsStore;
