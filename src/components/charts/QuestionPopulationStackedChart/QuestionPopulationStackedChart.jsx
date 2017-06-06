import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
//import { scaleTime } from 'd3-scale';
import LoadingIndicator from '../../LoadingIndicator';
import QuestionService from "../../../services/QuestionService";

const QuestionPopulationStackedChart = inject("CensusDataStore", "DemographicsDataStore", "QuestionStore")(({ CensusDataStore, DemographicsDataStore, QuestionStore, questionId, geoId, data, height = null}) => {
  let certainityStatisticsArr = null;
  let currentlyShowingIndex = null;
  let viewData = observable.shallowObject({
    values: null
  });

  initData(function (censusData, demogrData, question) {
    viewData.values = question.choices && generateDemogrChartData(demogrData, question.choices); // generate only if question loaded
    viewData.values = setCensusChartData(viewData.values, censusData[0]);
  })

	return (
    <QuestionPopulationStackedChartView data={viewData} height={height} />
	)

  function initData(cb) {
    let finishedReqCount = 0;
    let censusData = null;
    let demogrData = null;
    let question = null;

    if (!geoId) geoId = 59;
    CensusDataStore.getCensusData(geoId).then(function (res) {
      if (res.results.length === 0) {
        return CensusDataStore.getCensusData(59).then((res) => {
          censusData = res.results;
          finishedReqCount++;
          finish();
        });
      }
      censusData = res.results;
      finishedReqCount++;
      finish();
    })

    DemographicsDataStore.getQuestionDemographicsData({
      questionId: questionId,
      // geoId: geoId
    }).then(function (res) {
      demogrData = res;
      finishedReqCount++;
      finish();
    })

    QuestionStore.loadQuestion(questionId).then((res) => {
      question = res;
      finishedReqCount++;
      finish();
    })


    let finish = () => {
      if (finishedReqCount === 3) cb(censusData, demogrData, question);
    }
  }
})

const QuestionPopulationStackedChartView = observer(({ data, height }) => {
  return (
    <div style={{width:'100%', height: '50%'}}>
      {!data.values && <LoadingIndicator />}
      {data.values &&
        <ResponsiveContainer minWidth={100} minHeight={100} height={height}><AreaChart width={600} height={400} data={data.values}
          margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
          <XAxis dataKey="age" />
          <YAxis orientation="left" yAxisId="left" />
          <YAxis orientation="right" yAxisId="right" tickFormatter={simpleFormatter} />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip labelFormatter={tootltipLabelFormatter} formatter={simpleFormatter} wrapperStyle={{zIndex: 1}} />
          <Area type='monotone' yAxisId="right" dataKey={'censusCount'} stackId="2" name={"Census"} fill="#d6d6d6" stroke="#d6d6d6" />
          {data.values[0].values.map((data, i) => {
          return <Area type='monotone' yAxisId="left" dataKey={'values[' + i + '].value'} fill={data.color} stroke={data.color}  stackId="1" key={data.id} name={data.name} />
          })}
      </AreaChart></ResponsiveContainer> }
    </div>
  );
})


/////////

function generateDemogrChartData(demogrData, choices) {
  return choices.length > 0 ? getDemographicsMcqData(demogrData, choices) : getDemographicsLikertData(demogrData);
}

function getDemographicsLikertData(demogrData) {
  let colors = QuestionService.getLikertColors().reverse();
  let demogrValues = demogrData.ageggendervalues;
  let answersNames = ["Strongly agree", "Agree", "Neutral", "Disagree", "Strongly disagree", "Skip"];
  let SKIP_INDEX = answersNames.length-1;
  let ages = ["<15", "15-25", "25-35", "35-45", "45-55", "55-65", "65-75", "75-85", "85+"];
  let ageToIndex = {}; // ageToIndex={"<15":0, "15-25":1, ... }

  /*
    resData = [
      { age:"<15", values: [ {name: "Agree", value: 40, color: "#000000"}, ... ] },
      ...
    ]
  */
  let resData = ages.map((age, i) => {
    ageToIndex[age] = i;
    return {
      age: age,
      values: answersNames.map((name, j) => ({
        id: j,
        name: name,
        value: 0,
        color: colors[j]
      }))
  }})

  let ageIndex, answerIndex;
  demogrValues.forEach((demogr, i) => {
    ageIndex = ageToIndex[demogr.age_range];
    answerIndex = demogr.value ? 5-demogr.value : SKIP_INDEX;
    resData[ageIndex].values[answerIndex].value += demogr.id__count
  })
  return resData;
}

function getDemographicsMcqData(demogrData, choices) {
  let colors = QuestionService.getMcqColors();
  let demogrValues = demogrData.ageggendervalues;

  // to qiuckly get and index of age/answer in resData
  let answerNameToIndex = {};
  let ageToIndex = {};
  let SKIP_INDEX = choices.length;

  let ages = ["<15", "15-25", "25-35", "35-45", "45-55", "55-65", "65-75", "75-85", "85+"];

  /*
      resData = [
        { age:"<15", values: [ {name: "Agree", value: 40, color: "#000000"}, ... ] },
        ...
      ]
    */
  let resData = ages.map((age, i) => {
    ageToIndex[age] = i;
    return {
      age: age,
      values: choices.map((choice, j) => {
        answerNameToIndex[choice.text] = j;
        return {
          id: choice.id,
          name: choice.text,
          value: 0,
          color: colors[j]
        }
      })
  }});

  let ageIndex, answerIndex;
  demogrValues.forEach((demogr, i) => {
    ageIndex = ageToIndex[demogr.age_range];
    answerIndex = demogr.object__text ? answerNameToIndex[demogr.object__text] : SKIP_INDEX;
    resData[ageIndex].values[answerIndex].value += demogr.id__count;
  })
  return resData;
}

//returns new array
function setCensusChartData(values, censusData) {
  let ages = ["<15", "15-25", "25-35", "35-45", "45-55", "55-65", "65-75", "75-85", "85+"];
  let resData = [];

  values.forEach((value) => {
    value.censusCount = 0
    resData.push(value);
  });

  for (var i = 0; i < 15; i++) { // for age <15
    resData[0].censusCount += censusData['age_' + i];
  }

  for (i = 15; i <= 25; i++) { // for age 15-25
    resData[1].censusCount += censusData['age_' + i];
  }

  for (i = 2; i <= 7; i++) { // for ages 25-35, 35-45, ..., 75-85
    for (let j = i * 10 + 6; j <= (i + 1) * 10 + 5; j++) {
      resData[i].censusCount += censusData['age_' + j];
    }
  }

  for (i = 86; i <= 90; i++) { // for age 86-90
    resData[8].censusCount += censusData['age_' + i];
  }
  return resData;
}

function simpleFormatter(val) {
  var valStr = val.toString();
  var resNum, ch;
  if (valStr.length > 6) { resNum = val/1000000; ch = 'M'; }
  else if (valStr.length > 3) { resNum = val/1000; ch = 'k'; }
  else { resNum = val; ch = ''; }
  let resStr = resNum.toString();
  let dotPosition = resStr.indexOf('.');
  if (dotPosition !== -1 && (resStr.length - dotPosition) > 2) {
    resStr = resStr.substr(0, dotPosition+2);
  }
  return resStr+ch;
}

function tootltipLabelFormatter(val) {
  return 'Age ' + val;
}

export default QuestionPopulationStackedChart;
