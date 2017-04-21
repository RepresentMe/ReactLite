import React from 'react';
import { inject } from "mobx-react";
import { observable } from "mobx";
import difference from 'lodash/difference';

//import TwoLevelPieChartView from './TwoLevelPieChartComponent';
import OneLevelPieChartView from './OneLevelPieChartComponent';


const QuestionLiquidPiechart = inject("QuestionStore")(({ QuestionStore, questionId, type = 1}) => {
    const likertProps = {
      'liquid_maximum': {name: 'Strongly Agree', color: 'rgb(74,178,70)', direct: 'direct_maximum'},
      'liquid_high': {name: 'Agree', color: 'rgb(133,202,102)', direct: 'direct_high'},
      'liquid_medium': {name: 'Medium', color: 'rgb(128, 128, 128)', direct: 'direct_medium'},
      'liquid_skipped': {name: 'Skip', color: 'rgb(198,199,202)', direct: 'direct_skipped'},
      'liquid_low': {name: 'Disagree', color: 'rgb(249,131,117)', direct: 'direct_low'},
      'liquid_minimum': {name: 'Strongly Disagree', color: 'rgb(244,56,41)', direct: 'direct_minimum'}
    }
    const colors_mcq = ['#0088FE', '#FFBB28', '#a3a375', '#FF8042', '#df64ef', '#38b4c4', '#ff80aa', '#a3a3c2', '#8cff66', '#66b3ff', '#a64dff', '#00ff80'];
    let viewData = observable.shallowObject({
      values: null
    });

    function* fetcherGen(){
      yield QuestionStore.getQuestionById(questionId)
      }

    //sorts the values in ascending and calcs the shift of label display
    //not to crowd the chart space
    const sortValues = (values) => {
      values = values.sort((a,b) => a.value-b.value)
      let arr = values.map((v) => v.value)
      arr.unshift(0)
      return values.map((v,i)=> Object.assign(v, {prev: arr[i]}))
    }

    const fetcher = fetcherGen();
    fetcher.next().value
      .then(question => {
        if (!question){
          //do something
        }
        else if (question.subtype === 'likert'){
          let sumLikert = 0;
          const labels = Object.keys(likertProps)
          for (let i = 0; i < labels.length; i++) {sumLikert += question[labels[i]]}
          viewData.values = labels.map((label,i) =>
            Object.assign({},
              {full_name: likertProps[label]['name']},
              {name: likertProps[label]['name']},
              {value: (Math.round(question[label]*10000/sumLikert)/100)},
              {fill: likertProps[label]['color']},
              {direct_vote_count: question[likertProps[label]['direct']]}
            ));
          viewData.values = sortValues(viewData.values)
          console.log('viewData.values', viewData.values)
        }
        else if (question.subtype === 'mcq'){
          //propose to filter out choices with 0 vote, cause they crowd the space
          const choices = question.choices.filter(choice => choice.direct_vote_count > 0)
          const zeroChoices = difference(question.choices, choices)

          viewData.values = choices.map((choice, i) =>
            Object.assign({},
              {full_name: choice.text},
              {name: choice.text.length > 20 ? choice.text.slice(0,20)+'...' : choice.text},
              {value: choice.direct_vote_count},
              {fill: colors_mcq[i%colors_mcq.length]},
              {zeroChoices: zeroChoices},
              {direct_vote_count: choice.direct_vote_count}
            )
          );
          viewData.values = sortValues(viewData.values)
          console.log('viewData.values', viewData.values)
        }
  })

    return (
      <div>
        {type === 1 && <OneLevelPieChartView data={viewData}/>}
        {/* {type === 2 && <TwoLevelPieChartView data={viewData}/>} */}
      </div>
      )
})

export default QuestionLiquidPiechart;
