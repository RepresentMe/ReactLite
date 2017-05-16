import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Rectangle, Text, ResponsiveContainer } from 'recharts';
import { scaleTime } from 'd3-scale';
import LoadingIndicator from '../../LoadingIndicator'; 
import QuestionService from "../../../services/QuestionService";


const QuestionResultsBarchart = inject("AppStatisticsStore")(observer(({ AppStatisticsStore, data }) => {
  let viewData = {
    values: data.question.choices && generateChartValues(data.question) // generate only if question loaded
  };

  return <QuestionResultsBarchartView data={viewData} />
}))

const SELECTED_BAR_BACKGROUND = '#1B8AAE';
const BAR_BACKGROUND = '#e6e6e6';
const BAR_HEIGHT = 24;
const BAR_MATGIN_TOP = 27;

const QuestionResultsBarchartView = observer(({ data }) => {
  return (
    <div>
      {!data.values && <LoadingIndicator />}
      {data.values && 
        <ResponsiveContainer minWidth={100} minHeight={data.values.length * (BAR_HEIGHT + BAR_MATGIN_TOP)}>
          <BarChart
            layout="vertical"
            data={data.values}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis domain={[0, 100]} hide={true} type="number"/>
            <YAxis type="category" hide={true} dataKey="name" />
            <Bar dataKey="votesPerc" barSize={BAR_HEIGHT} shape={CustomBar} label={<CustomizedLabel />} animationDuration={0}/>
          </BarChart>
        </ResponsiveContainer>}
    </div>
  );
})

const CustomBar = (props) => {
  const { payload, x, y, width, height } = props;
  let customWidth = payload.isZeroPerc ? 0 : width;
  let bgWidth = (payload.isZeroPerc ? width : customWidth)* 100 / payload.votesPerc;
  
  return (<g>
    {payload.isSelected && <Rectangle x={x - 1} y={y - 1} width={customWidth * 100 / payload.votesPerc + 2} height={height + 2} radius={[3, 3, 3, 3]} fill={SELECTED_BAR_BACKGROUND} />}
    <Rectangle x={x} y={y} width={bgWidth} height={height} radius={[3, 3, 3, 3]} fill={BAR_BACKGROUND} />
    <Rectangle {...props} width={customWidth} height={height} radius={[3,0,0,3]} fill={payload.color} />
  </g>);
};

const CustomizedLabel = (props) => {
  const { x, y, stroke, text, width, payload } = props;
  let shadowStyle = (<defs>
    <filter id={"votes_bar_name_shadow_"+y} x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="2 2" result="shadow" />
      <feOffset dx="2" dy="2" />
    </filter>
  </defs>);
  return <g>
    {shadowStyle}
    <text style={{filter: 'url(#votes_bar_name_shadow_'+y+')', fill: 'black'}} x={x} y={y} dx={-width}>{payload.name}</text>
    <Text x={x} y={y} dx={-width} fill="white" >{payload.name}</Text>
    <Text x={x} y={y} dx={100 * width / payload.votesPerc-x-20} fill="grey" >{Math.floor(payload.isZeroPerc ? 0 : payload.votesPerc)+'%'}</Text>
  </g>
}

/////////



function generateChartValues(q) {
  return q.choices.length > 0 ? generateMcqChartValues(q) : generateLikertChartValues(q);
}

/*
  Warning: kludge
  Notice that if curVoteCount==0, then votesPerc is 1 and isZeroPerc=true. That is needed
  to make styling of bars working correctly.
*/
function generateLikertChartValues(q) {
  let colors = QuestionService.getLikertColors();
  let answerNames = ["Strongly disagree", "Disagree", "Neutral", "Agree", "Strongly agree"];
  let answerKeys = ["liquid_minimum", "liquid_low", "liquid_medium", "liquid_high", "liquid_maximum"];
  let zeroVoteCount = q.liquid_vote_count == 0;
  let tmp = !zeroVoteCount && 100 / q.liquid_vote_count; // used to calculate percentage of answer

  return answerNames.map((name, i) => {
    let curVoteCount = q[answerKeys[i]];
    return {
      name: name,
      votesPerc: (zeroVoteCount || curVoteCount == 0) ? 1 : curVoteCount * tmp,
      isZeroPerc: zeroVoteCount || curVoteCount == 0, // a tweak to make chart working
      isSelected: q.my_vote[0].value == (i + 1),
      color: colors[i]
    }
  })
}
function generateMcqChartValues(q) {
  let colors = QuestionService.getMcqColors(q.choices);
  let zeroVoteCount = q.liquid_vote_count == 0;
  let tmp = !zeroVoteCount && 100 / q.liquid_vote_count; // used to calculate percentage of answer
  return q.choices.map(function(choice, i) {
    return {
      name: choice.text,
      votesPerc: (zeroVoteCount || choice.liquid_vote_count == 0) ? 1 : choice.liquid_vote_count * tmp,
      isZeroPerc: zeroVoteCount || choice.liquid_vote_count == 0, // a tweak to make chart working
      isSelected: q.my_vote[0].object_id == choice.id,
      color: colors[choice.id]
    }
  })
}

export default QuestionResultsBarchart;
