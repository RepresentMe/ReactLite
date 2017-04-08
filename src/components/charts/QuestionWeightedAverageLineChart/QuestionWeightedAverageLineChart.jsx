import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";
import {LineChart, Line, XAxis, YAxis, ReferenceArea, Tooltip, Legend, AxisLabel} from 'recharts';

const mergeDataPoints = (a, b) => {

  if(!a) {
    return b;
  }else if(!b) {
    return a;
  }

  return {
    age:                    a.age + ", " + b.age,
    average_vote:           (a.average_vote + b.average_vote) / 2, // Will be appended once no. of voters added
    weighted_average_vote:  (a.weighted_average_vote + b.weighted_average_vote) / 2,
    error_margin:            (a.error_margin + b.error_margin) / 2
  }
}

Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

const QuestionWeightedAverageLineChart = inject("DemographicsDataStore")(observer((props) => {

  let {DemographicsDataStore, questionId, startAge = 0, endAge = 200, bucketSize = 1} = props;

  let ageData = DemographicsDataStore.getWeightedQuestionAverageDataByAge(questionId);

  if(!questionId || ageData.constructor.name === "Promise") { // If promise returned, data is still loading
    return null;
  }

  let filteredData = [];
  ageData.map((dataPoint, index) => { // Filter results by age
    if(dataPoint.age >= startAge && dataPoint.age <= endAge) {
      filteredData.push(dataPoint);
    }
  })

  let bucketData = [];
  let bucketIterator = 0;
  filteredData.map((dataPoint, index) => { // Put data into buckets
    bucketData[Math.round(index / bucketSize) * bucketSize] = mergeDataPoints(bucketData[Math.round(index / bucketSize) * bucketSize], dataPoint);
  });
  bucketData.clean(undefined);

  return (
    <div>
      <LineChart width={600} height={400} data={bucketData} margin={{top: 5, right: 30, left: 20, bottom: 5}} syncId="weighted_age_chart">
        <XAxis dataKey="age" label="Age (years)"/>
        <YAxis domain={[0, 5]} ticks={[0,1,2,3,4,5]} label="Average Vote"/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="average_vote" stroke="#b3bccc" dot={false} strokeWidth={3}/>
        <Line type="monotone" dataKey="weighted_average_vote" stroke="#677284" dot={false} strokeWidth={3}/>
        <ReferenceArea y1={0} y2={1} fill="#fc5f5f" />
        <ReferenceArea y1={1} y2={2} fill="#ffbcbc" />
        <ReferenceArea y1={2} y2={3} fill="#ededed" />
        <ReferenceArea y1={3} y2={4} fill="#c6fcbf" />
        <ReferenceArea y1={4} y2={5} fill="#82d877" />
      </LineChart>

      <LineChart width={600} height={100} data={bucketData} margin={{top: 5, right: 30, left: 20, bottom: 5}}  syncId="weighted_age_chart">
        <XAxis dataKey="age" label="Age (years)"/>
        <YAxis label="Error Margin"/>
        <Tooltip/>
        <Legend />
        <Line type="monotone" dataKey="error_margin" stroke="#b3bccc" dot={false} strokeWidth={3}/>
      </LineChart>
    </div>
  )

}))

export default QuestionWeightedAverageLineChart;
