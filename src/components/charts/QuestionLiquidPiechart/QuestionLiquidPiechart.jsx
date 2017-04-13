import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction } from "mobx";

import {PieChart, Pie, Sector, Cell, ResponsiveContainer} from 'recharts';
import LoadingIndicator from '../../LoadingIndicator';


const QuestionLiquidPiechart = inject("QuestionStore")(({ QuestionStore, questionId, labels}) => {
    labels = ['liquid_high', 'liquid_low', 'liquid_maximum', 'liquid_medium', 'liquid_minimum']
    questionId = 14
    let viewData = observable.shallowObject({
      values: null
    });

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
      .then(function(res) {
        questionData = labels.map(label =>
          Object.assign({}, {name: label}, {value: res[label]}))
        finish();
      })
    }


})

// const data = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
//                   {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

const PIE_HEIGHT = 300;

const QuestionLiquidPiechartView = observer(({data}) => {

  const COLORS = ['red', 'orange', 'yellow', 'navy', 'lime'];
  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
   	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="central">
      	{`${(percent * 100).toFixed(0)}%`}
      </text>
      );
    };

	return (
    <div>
      {!data && <LoadingIndicator />}
      {data && <ResponsiveContainer height={PIE_HEIGHT}>
      	<PieChart
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>

          <Pie
            data={data.values}
            labelLine={false}
            label={renderCustomizedLabel}
            innerRadius={30}
            outerRadius={100}
            fill="#8884d8"
            cx={200}
            cy={200}
          >
          	{/* {
            	data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
            } */}
          </Pie>
        </PieChart>
      </ResponsiveContainer>}
    </div>
    );
  })

export default QuestionLiquidPiechart;
