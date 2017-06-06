import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
//import { observable, reaction } from "mobx";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer, Text} from 'recharts';

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
    "dataKey": "error_margin",
    "type": "rect",
    "color": "#42d9f4",
    "value": "Error margin",
    "payload": {
      "barSize": 30,
      "dataKey": "error_margin",
      "yAxisId": "right",
      "fill": "#42d9f4",
      "isAnimationActive": false,
      "xAxisId": 0,
      "legendType": "rect",
      "minPointSize": 0,
      "data": [],
      "layout": "vertical",
      "animationBegin": 0,
      "animationDuration": 1500,
      "animationEasing": "ease"
    }
  },
  {
    "dataKey": "sample_size",
    "type": "rect",
    "color": "#8884d8",
    "value": "Sample size",
    "payload": {
      "label": true,
      "barSize": 30,
      "dataKey": "sample_size",
      "yAxisId": "left",
      "fill": "#8884d8",
      "isAnimationActive": false,
      "xAxisId": 0,
      "legendType": "rect",
      "minPointSize": 0,
      "data": [],
      "layout": "vertical",
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

    let geoData = DemographicsDataStore.getWeightedQuestionAverageDataByGeo(questionId, 13, 30);
    let questionData = QuestionStore.getQuestionById(questionId);


    if(!questionId || geoData.constructor.name === "Promise" || questionData.constructor.name === "Promise") { // If promise returned, data is still loading
      return null;
    }else {
      if(!this.state.finished) {
        this.setState({finished: true});
      }
    }

    //console.log(geoData);

    let keyValueGeos = []
    let totalSampleSize = 0

    let UKAverage = {
      geo_name: "UK",
      error_margin: 0,
      sample_size: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    }

    geoData.map((geo, index) => {

      let tempValue = {geo_id: geo.region_id, geo_name: countryMap[geo.region_id], error_margin: geo.error_margin, sample_size: geo.sample_size}

      UKAverage.error_margin = (UKAverage.error_margin * UKAverage.sample_size + geo.error_margin * geo.sample_size) / (UKAverage.sample_size + geo.sample_size)
      UKAverage.sample_size = UKAverage.sample_size + geo.sample_size

      for (var key in geo.weighted_vote_breakdown) {
        tempValue[key] = parseFloat(geo.weighted_vote_breakdown[key].percentage)
        UKAverage[key] = ((UKAverage[key] * UKAverage.sample_size) + (geo.weighted_vote_breakdown[key].weighted_raw * geo.sample_size)) / (UKAverage.sample_size + geo.sample_size)
      }

      keyValueGeos.push(tempValue)
      totalSampleSize = totalSampleSize + geo.sample_size
    });

    let UKAverageTotal = 0
    for (let i = 1; i <= 5; i++) {
      UKAverageTotal = UKAverageTotal + UKAverage[i]
    }

    for (let i = 1; i <= 5; i++) {
      UKAverage[i] = UKAverage[i] * 100/ UKAverageTotal
    }

    keyValueGeos.push(UKAverage)

    return (
      <div style={{height: '100%', width: '100%', position: 'absolute'}}>
        <h3 style={{textAlign: 'center', margin: '10px 20px'}}>{questionData.question}</h3>
        <ResponsiveContainer width={1024} height={450}>
          <BarChart width={600} height={300} data={keyValueGeos}
            margin={{top: 5, right: 80, left: 50, bottom: 5}}>
            <XAxis dataKey="geo_name" />
            <YAxis domain={[0, 100]} ticks={[0,25,50,75,100]}/>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <Bar label={customLabelRenderLikert} dataKey="1" fill="#fc5f5f" isAnimationActive={false}/>
            <Bar label={customLabelRenderLikert} dataKey="2" fill="#ffbcbc" isAnimationActive={false}/>
            <Bar label={customLabelRenderLikert} dataKey="3" fill="#ededed" isAnimationActive={false}/>
            <Bar label={customLabelRenderLikert} dataKey="4" fill="#c6fcbf" isAnimationActive={false}/>
            <Bar label={customLabelRenderLikert} dataKey="5" fill="#82d877" isAnimationActive={false}/>
          </BarChart>
        </ResponsiveContainer>
        <ResponsiveContainer width={1024} height={200}>
          <BarChart width={600} height={300} data={keyValueGeos}
            margin={{top: 20, right: 20, left: 50, bottom: 5}}>
            <XAxis dataKey="geo_name" />
            <YAxis yAxisId="left" orientation="left" stroke="#8884d8"/>
            <YAxis yAxisId="right" orientation="right" stroke="#42d9f4"/>
            <Legend payload={customLegend}  wrapperStyle={{bottom: '-20px'}}/>
            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
            <Bar label={true} barSize={30} dataKey="sample_size" yAxisId="left" fill="#8884d8" isAnimationActive={false}/>
            <Bar label={customLabelRender} barSize={30} dataKey="error_margin" yAxisId="right" fill="#42d9f4" isAnimationActive={false}/>
          </BarChart>
        </ResponsiveContainer>
        <p style={{"position":"absolute","textAlign":"center","top":"220px","left":"-40px","width":"150px","WebkitTransform":"rotate(-90deg)"}}>Weighted vote breakdown (%)</p>
        <p style={{"position":"absolute","textAlign":"center","top":"535px","left":"-40px","width":"150px","WebkitTransform":"rotate(-90deg)"}}>Sample size (people)</p>
        <p style={{"position":"absolute","textAlign":"center","top":"545px","right":"-40px","width":"150px","WebkitTransform":"rotate(90deg)"}}>Error margin (%)</p>
        <p style={{right: '30px', bottom: '0px', position: 'absolute'}}><b>Total sample size {totalSampleSize} people</b></p>
      </div>
    )
  }

  componentDidUpdate() {
    if(this.state.finished) { // If promise returned, data is still loading
      console.log("WITNESS_ME");
    }
  }

}

const customLabelRender = (props) => {
  let labelItem = null;

    labelItem = (
      <Text
        {...props}
        className="recharts-bar-label"
      >
        {"" + (Math.round(props.error_margin * 10) / 10) + "%"}
      </Text>
    );

  return labelItem;
}

const customLabelRenderLikert = (props) => {
  let labelItem = null;

    labelItem = (
      <Text
        {...props}
        fill="#474747"
        className="recharts-bar-label"
      >
        {(parseInt(props.value)) + "%"}
      </Text>
    );

  return labelItem;
}

const countryMap = {
  45690: "England",
  45691: "N. Ireland",
  45692: "Scotland",
  45693: "Wales",
}

const customTickMap = {
  0.5: "Stongly disagree",
  1.5: "Disagree",
  2.5: "Neutral",
  3.5: "Agree",
  4.5: "Stongly agree",
}
