import React from 'react';
import { inject } from "mobx-react";
import { observable } from "mobx";
import difference from 'lodash/difference';

import TwoLevelPieChartView from './TwoLevelPieChartComponent';
import OneLevelPieChartView from './OneLevelPieChartComponent';


const QuestionLiquidPiechart = inject("QuestionStore")(({ QuestionStore, questionId}) => {
    const likertProps = {
      'liquid_maximum': {name: 'STRONGLY AGREE', color: 'rgb(74,178,70)', direct: 'direct_maximum'},
      'liquid_high': {name: 'AGREE', color: 'rgb(133,202,102)', direct: 'direct_high'},
      'liquid_medium': {name: 'MEDIUM', color: 'rgb(128, 128, 128)', direct: 'direct_medium'},
      'liquid_skipped': {name: 'SKIP', color: 'rgb(198,199,202)', direct: 'direct_skipped'},
      'liquid_low': {name: 'DISAGREE', color: 'rgb(249,131,117)', direct: 'direct_low'},
      'liquid_minimum': {name: 'STRONGLY DISAGREE', color: 'rgb(244,56,41)', direct: 'direct_minimum'}
    }
    const colors_mcq = ['#0088FE', '#FFBB28', '#a3a375', '#FF8042', '#df64ef', '#38b4c4', '#ff80aa', '#a3a3c2', '#8cff66', '#66b3ff', '#a64dff', '#00ff80'];
    let viewData = observable.shallowObject({
      values: null
    });

    function* fetcherGen(){
      yield QuestionStore.getQuestionById(questionId)
      }

    const fetcher = fetcherGen();

    fetcher.next().value
      .then(res => {
        if (!res){
          //do something
        }
        else if (res.subtype === 'likert'){
          let sumLikert = 0;
          const labels = Object.keys(likertProps)
          for (let i = 0; i < labels.length; i++) {sumLikert += res[labels[i]]}
          viewData.values = labels.map((label,i) =>
            Object.assign({},
              {name: likertProps[label]['name']},
              {value: (Math.round(res[label]*10000/sumLikert)/100)},
              {fill: likertProps[label]['color']},
              {direct_vote_count: res[likertProps[label]['direct']]}
            ));
        }
        else if (res.subtype === 'mcq'){
          //propose to filter out choices with 0 vote, cause they crowd the space
          const choices = res.choices.filter(choice => choice.direct_vote_count > 0)
          const zeroChoices = difference(res.choices, choices)

          viewData.values = choices.map((choice, i) =>
            Object.assign({},
              {name: choice.text},
              {value: choice.direct_vote_count},
              {fill: colors_mcq[i%colors_mcq.length]},
              {zeroChoices: zeroChoices},
              {direct_vote_count: choice.direct_vote_count}
            )
          );
        }});

    return (
      <div>
        <OneLevelPieChartView data={viewData}/>
        <TwoLevelPieChartView data={viewData}/>
      </div>
      )
})

export default QuestionLiquidPiechart;

/*
initData(function (questionData) {
  viewData.values = questionData;
  console.log('viewData', viewData.values)
  })

return (
    <QuestionLiquidPiechartView data={viewData} />
  )


function initData(cb) {
  let questionData = null;

  let finish = () => {
    cb(questionData);
  }

  QuestionStore.getQuestionById(questionId)
  .then(res => {
    questionData = labels.map((label,i) =>
      Object.assign({}, {name: label}, {value: res[label]}, {fill: colors[i]}))
    finish();
  })
}*/
