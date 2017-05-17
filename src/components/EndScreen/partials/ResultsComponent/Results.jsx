import React from 'react';
import { inject, observer } from "mobx-react";
import { observable } from "mobx";

import SmallCard from '../SmallCard'


const Results = inject("QuestionStore")(({ QuestionStore, questionId}) => {
    const likertProps = {
      'liquid_minimum': {name: 'Strongly Disagree', color: 'rgb(244,56,41)', direct: 'direct_minimum'},
      'liquid_low': {name: 'Disagree', color: 'rgb(249,131,117)', direct: 'direct_low'},
      'liquid_medium': {name: 'Medium', color: 'rgb(128, 128, 128)', direct: 'direct_medium'},
      'liquid_high': {name: 'Agree', color: 'rgb(133,202,102)', direct: 'direct_high'},
      'liquid_maximum': {name: 'Strongly Agree', color: 'rgb(74,178,70)', direct: 'direct_maximum'},
      //'liquid_skipped': {name: 'Skip', color: 'rgb(198,199,202)', direct: 'direct_skipped'},

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
      .then(question => {
        //console.log(question)
        console.log('question', question);
        if (!question){
          //do something
        }
        else
        if (question.my_vote.length > 0 && question.subtype === 'likert'){
          // //propose to filter out choices with 0 vote, cause they crowd the space
          let myVote = null;
          if (question.my_vote.length > 0) {myVote = question.my_vote[0].value;}
          let sumLikert = 0, sumAgree = 0, sumDisagree = 0;
          let labels = Object.keys(likertProps)
          for (let i = 0; i < labels.length; i++) {sumLikert += question[labels[i]]}
          sumAgree = Math.round((question[labels[3]] + question[labels[4]])*1000/sumLikert)/10
          sumDisagree = Math.round((question[labels[0]] + question[labels[1]])*1000/sumLikert)/10

          let result = []
          for (let i = 0; i < labels.length; i++){
            if (myVote !== null && myVote === i+1) {
              const percentage = myVote < 2 ? sumDisagree : myVote > 2 ? sumAgree : Math.round(question[labels[i]]*1000/sumLikert)/10;
              const full_name = likertProps[labels[i]]['name'] === "Medium" ? "Neutral" : likertProps[labels[i]]['name']
              result.push(Object.assign({},
                {full_name},
                //{value: (Math.round(question[labels[i]]*1000/sumLikert)/10)},
                {percentage},
                {fill: likertProps[labels[i]]['color']},
                // {direct_vote_count: question[likertProps[label]['direct']]},
                {title: question['question']}
              ))
            }
          }
          viewData.values = result;
        }

        else if (question.my_vote.length > 0 && question.subtype === 'mcq'){
          //propose to filter out choices with 0 vote, cause they crowd the space
          const choices = question.choices.filter(choice => choice.direct_vote_count > 0)
          //const zeroChoices = difference(question.choices, choices)
          let myVote = null;
          if (question.my_vote.length > 0) {myVote = question.my_vote[0].object_id; ;}
          let sumMCQ = 0;
          for (let i = 0; i < choices.length; i++) {sumMCQ += choices[i].direct_vote_count}
          let result = []
          for (let i = 0; i < choices.length; i++) {
            //console.log('choices[i]',choices[i])
            if (myVote === choices[i].id){
            result.push( Object.assign({},
              {full_name: choices[i].text},
              //{name: choice.text.length > 20 ? choice.text.slice(0,20)+'...' : choice.text},
              //{value: choices[i].direct_vote_count},
              {percentage: (Math.round(choices[i].direct_vote_count*1000/sumMCQ)/10)},
              {fill: colors_mcq[i%colors_mcq.length]},
              //{zeroChoices: zeroChoices},
              // {direct_vote_count: choice.direct_vote_count},
              {title: question['question']}
            ))
          }}
          viewData.values = result;
        }
        //if didn't answer that question
        else if (!question.my_vote.length){
          let result = []
          result.push( Object.assign({},
            {full_name: null},
            {percentage: null},
            {fill: 'white'},
            {title: question['question']}))
          viewData.values = result;
        }
      })


      return (
        <div>
          <SmallCard data={viewData}/>
        </div>
      )
    }
  )

  export default Results;
