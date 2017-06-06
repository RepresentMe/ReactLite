import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
//import { observable, reaction } from "mobx";
import {AreaChart, CartesianGrid, LineChart, Line, XAxis, YAxis, ReferenceArea, Tooltip, Legend, AxisLabel, ResponsiveContainer, Area} from 'recharts';

const mergeDataPoints = (a, b) => {

  if(!a) {
    return b;
  }else if(!b) {
    return a;
  }

  let weighted_vote_breakdown = {};
  for (let i = 1; i <= 5; i++) {
    weighted_vote_breakdown[i] = ((a.weighted_vote_breakdown[i] * a.sample_size) + (b.weighted_vote_breakdown[i] * b.sample_size)) / (a.sample_size + b.sample_size);
  }

  return {
    age:                    a.age + ", " + b.age,
    average_vote:           ((a.average_vote * a.sample_size) + (b.average_vote * b.sample_size)) / (a.sample_size + b.sample_size), // Will be appended once no. of voters added
    weighted_average_vote:  ((a.weighted_average_vote * a.sample_size) + (b.weighted_average_vote * b.sample_size)) / (a.sample_size + b.sample_size),
    error_margin_weighted:           ((a.error_margin_weighted * a.sample_size) + (b.error_margin_weighted * b.sample_size)) / (a.sample_size + b.sample_size),
    error_margin:           ((a.error_margin * a.sample_size) + (b.error_margin * b.sample_size)) / (a.sample_size + b.sample_size),
    sample_size:            a.sample_size + b.sample_size,
    weighted_vote_breakdown
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

const customLegend = [
  {
    "dataKey": "average_vote",
    "type": "line",
    "color": "#b3bccc",
    "value": "Average vote",
    "payload": {
      "type": "monotone",
      "dataKey": "average_vote",
      "stroke": "#b3bccc",
      "dot": false,
      "strokeWidth": 3,
      "xAxisId": 0,
      "yAxisId": 0,
      "connectNulls": false,
      "activeDot": true,
      "legendType": "line",
      "fill": "#b3bccc",
      "points": [],
      "isAnimationActive": true,
      "animationBegin": 0,
      "animationDuration": 1500,
      "animationEasing": "ease"
    }
  },
  {
    "dataKey": "weighted_average_vote",
    "type": "line",
    "color": "#677284",
    "value": "Average vote (weighted)",
    "payload": {
      "type": "monotone",
      "dataKey": "weighted_average_vote",
      "stroke": "#677284",
      "dot": false,
      "strokeWidth": 3,
      "xAxisId": 0,
      "yAxisId": 0,
      "connectNulls": false,
      "activeDot": true,
      "legendType": "line",
      "fill": "#677284",
      "points": [],
      "isAnimationActive": true,
      "animationBegin": 0,
      "animationDuration": 1500,
      "animationEasing": "ease"
    }
  },
  {
    "dataKey": "weighted_average_vote",
    "type": "line",
    "color": "#82ca9d",
    "value": "Error margin (%)",
    "payload": {
      "type": "monotone",
      "dataKey": "weighted_average_vote",
      "stroke": "#82ca9d",
      "dot": false,
      "strokeWidth": 3,
      "xAxisId": 0,
      "yAxisId": 0,
      "connectNulls": false,
      "activeDot": true,
      "legendType": "line",
      "fill": "#82ca9d",
      "points": [],
      "isAnimationActive": true,
      "animationBegin": 0,
      "animationDuration": 1500,
      "animationEasing": "ease"
    }
  },
  {
    "dataKey": "weighted_average_vote",
    "type": "line",
    "color": "#42d9f4",
    "value": "Sample size (people)",
    "payload": {
      "type": "monotone",
      "dataKey": "weighted_average_vote",
      "stroke": "#42d9f4",
      "dot": false,
      "strokeWidth": 3,
      "xAxisId": 0,
      "yAxisId": 0,
      "connectNulls": false,
      "activeDot": true,
      "legendType": "line",
      "fill": "#42d9f4",
      "points": [],
      "isAnimationActive": true,
      "animationBegin": 0,
      "animationDuration": 1500,
      "animationEasing": "ease"
    }
  }
];

export default @inject("DemographicsDataStore", "QuestionStore") @observer class QuestionWeightedAverageLineChart extends Component {

  constructor() {
    super();
    this.state = {
      finished: false
    }
  }

  render() {

    let {DemographicsDataStore, QuestionStore, questionId, startAge = 0, endAge = 200, bucketSize = 1} = this.props;

    let ageData = DemographicsDataStore.getWeightedQuestionAverageDataByAge(questionId);
    let questionData = QuestionStore.getQuestionById(questionId);


    if(!questionId || ageData.constructor.name === "Promise" || questionData.constructor.name === "Promise") { // If promise returned, data is still loading
      return null;
    }else {
      if(!this.state.finished) {
        this.setState({finished: true});
      }
    }

    let filteredData = [];
    ageData.map((dataPoint, index) => { // Filter results by age
      if(dataPoint.age >= startAge && dataPoint.age <= endAge) {
        filteredData.push(dataPoint);
      }
    })

    let bucketData = [];
    filteredData.map((dataPoint, index) => { // Put data into buckets
      bucketData[Math.round((index + 1) / bucketSize) * bucketSize] = mergeDataPoints(bucketData[Math.round((index + 1) / bucketSize) * bucketSize], dataPoint);
    });
    bucketData.clean(undefined);

    let totalSampleSize = 0;
    bucketData.map((dataPoint, index) => {
      totalSampleSize = totalSampleSize + dataPoint.sample_size
    });

    return (
      <div style={{height: '100%', width: '100%', position: 'absolute'}}>
        <h3 style={{textAlign: 'center', margin: '10px 20px'}}>{questionData.question}</h3>
        <ResponsiveContainer width={1024} height={280}>
          <LineChart width={600} height={300} data={bucketData} margin={{top: 20, right: 80, left: 40, bottom: 0}} syncId="weighted_age_chart">
            <YAxis domain={[0, 5]} tick={<CustomLikertTicks/>} ticks={[0.5,1.5,2.5,3.5,4.5]}/>
            <XAxis dataKey="age"/>
            <Legend verticalAlign="top" height={36} payload={customLegend} wrapperStyle={{marginTop: '-20px'}}/>
            <Tooltip/>
            <Line isAnimationActive={false} type="monotone" dataKey="average_vote" stroke="#b3bccc" dot={false} strokeWidth={3}/>
            <Line isAnimationActive={false} type="monotone" dataKey="weighted_average_vote" stroke="#677284" dot={false} strokeWidth={3}/>
            <ReferenceArea y1={0} y2={1} fill="#fc5f5f" />
            <ReferenceArea y1={1} y2={2} fill="#ffbcbc" />
            <ReferenceArea y1={2} y2={3} fill="#ededed" />
            <ReferenceArea y1={3} y2={4} fill="#c6fcbf" />
            <ReferenceArea y1={4} y2={5} fill="#82d877" />
            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
          </LineChart>
        </ResponsiveContainer>

        <ResponsiveContainer width={1024} height={210}>
          <AreaChart data={bucketData} margin={{top: 0, right: 80, left: 40, bottom: 0}}>
            <YAxis domain={[0, 100]} ticks={[0,50,100]}/>
            <XAxis dataKey="age"/>
            <CartesianGrid strokeDasharray="3 3"/>
            <Tooltip/>
            <Area isAnimationActive={false} type='monotone' dataKey='weighted_vote_breakdown.5' stackId="1" fill='#82d877' stroke="" />
            <Area isAnimationActive={false} type='monotone' dataKey='weighted_vote_breakdown.4' stackId="1" fill='#c6fcbf' stroke="" />
            <Area isAnimationActive={false} type='monotone' dataKey='weighted_vote_breakdown.3' stackId="1" fill='#ededed' stroke="" />
            <Area isAnimationActive={false} type='monotone' dataKey='weighted_vote_breakdown.2' stackId="1" fill='#ffbcbc' stroke="" />
            <Area isAnimationActive={false} type='monotone' dataKey='weighted_vote_breakdown.1' stackId="1" fill='#fc5f5f' stroke="" />
          </AreaChart>
        </ResponsiveContainer>

        <ResponsiveContainer width={1024} height={150}>
          <LineChart data={bucketData} margin={{top: 5, right: 20, left: 40}}  syncId="weighted_age_chart">
            <XAxis dataKey="age"/>
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
            <YAxis yAxisId="right" orientation="right" stroke="#42d9f4"/>
            {/*}<Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="error_margin" stroke="#82ca9d" dot={false} strokeWidth={1}/>*/}
            <Line isAnimationActive={false} yAxisId="right" type="monotone" dataKey="error_margin" stroke="#42d9f4" dot={false} strokeWidth={1}/>
            <Line isAnimationActive={false} yAxisId="left" type="monotone" dataKey="sample_size" stroke="#8884d8" dot={false} strokeWidth={3}/>
            <CartesianGrid strokeDasharray="3 3" horizontal={false}/>
          </LineChart>
        </ResponsiveContainer>
        <p style={{textAlign: 'center', width: '100%'}}>Age (years)</p>
        <p style={{right: '30px', bottom: '0px', position: 'absolute'}}><b>Total sample size {totalSampleSize} people</b></p>
        <p style={{"position":"absolute","textAlign":"center","top":"380px","left":"-40px","width":"150px","WebkitTransform":"rotate(-90deg)"}}>Weighted vote breakdown (%)</p>
        <p style={{"position":"absolute","textAlign":"center","top":"555px","left":"-40px","width":"150px","WebkitTransform":"rotate(-90deg)"}}>Sample size (people)</p>
        <p style={{"position":"absolute","textAlign":"center","top":"575px","right":"-40px","width":"150px","WebkitTransform":"rotate(90deg)"}}>Error margin (%)</p>
      </div>
    )
  }

  componentDidUpdate() {
    if(this.state.finished) { // If promise returned, data is still loading
      console.log("WITNESS_ME");
    }
  }

}

const customTickMap = {
  0.5: "Stongly disagree",
  1.5: "Disagree",
  2.5: "Neutral",
  3.5: "Agree",
  4.5: "Stongly agree",
}

const CustomLikertTicks = (props) => {

  return (
    <g>
    <foreignObject x={props.x - 80} y={(customTickMap[props.payload.value].length > 8 ? props.y - 15 : props.y - 5)} width="80" height="100" textAnchor="middle">
      <p xmlns="http://www.w3.org/1999/xhtml">{customTickMap[props.payload.value]}</p>
    </foreignObject>
    </g>
  )
}
