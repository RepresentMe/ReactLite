class QuestionService {
  constructor() {
  }

  likertColors = ['#F43829', '#F98375', '#C6C7CA', '#85CA66', '#4AB246'];
  mcqColors = ['#294164', '#F15124', '#1B8AAE', '#7AC943', '#9C3C86', '#e9a12f', '#DAA520', '#CD5C5C', '#FFFF00', '#FF1493', '#9370DB', '#8B7B8B'];

  getLikertColors() {
    return this.likertColors;
  }

  // returns an object { choice.id: color }
  getMcqColors(choices) {
    let colorsObj = {};
    choices.sort((a,b) => a.id-b.id);
    
    for (var i = 0; i < choices.length; i++) {
      colorsObj[choices[i].id] = this.mcqColors[i];      
    }
    return colorsObj;
  }



}

export default new QuestionService;
