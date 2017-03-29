import React from 'react';
import { inject, observer } from "mobx-react";
import { observable, reaction  } from "mobx";

import './styles.css';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import LoadingIndicator from '../../LoadingIndicator';

const AgeProfileBarchart = inject("DemographicsDataStore")(({DemographicsDataStore, size, geoId}) => {

  let viewData = observable.shallowObject({
    width: (size && size.width) || 400,
    height: (size && size.height) || 300,
    values: computeBarchartData(DemographicsDataStore.usersDemographicsData.get(geoId))
  });

  if (!viewData.values) {
    DemographicsDataStore.getUsersDemographicsData(geoId);
    reaction(() => DemographicsDataStore.usersDemographicsData.get(geoId), (demographicData) => {
      viewData.values = computeBarchartData(demographicData);
    })
  }

  return (
    <AgeProfileBarchartView data={viewData} />
  )
})

const AgeProfileBarchartView = observer(({ data }) => {
  return (
    <div style={{width:data.width, height: data.height}}>
      {!data.values && <LoadingIndicator />}
      {data.values && <BarChart width={data.width} height={data.height} data={data.values} className="age-profile-barchart">
        <XAxis dataKey="age" />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip content={<CustomTooltip />}/>
        <Legend content={<CustomLegend/>}/>
        <Bar type="monotone" stackId="a" dataKey="notSay" fill="#faaccf" />
        <Bar type="monotone" stackId="a" dataKey="other" fill="#ffc658" />
        <Bar type="monotone" stackId="a" dataKey="female" fill="#82ca9d" />
        <Bar type="monotone" stackId="a" dataKey="male" fill="#8884d8" />
      </BarChart>}
    </div>
  );
})

/////////

let genderToTooltipTextObj = {
  'male': "Male",
  'female': "Female",
  'other': "Other",
  'notSay': "Rather not say"
}
let CustomTooltip = (props) => {
  if (props.active) {
    const { payload, label } = props;
    return (
      <div className="custom-tooltip">
        <p className="title">Age {payload[0].payload.age}</p>
        <ul>
          {payload.reverse().map((payl) => {
            return (
              <li className="label" key={payl.name}>
                <span className="color" style={{ 'backgroundColor': payl.color }}></span>
                {genderToTooltipTextObj[payl.name]}:
                <span className="value">{payl.value} people</span>
              </li >)
          })}
        </ul>
      </div>
    );
  } else return null;
}
const CustomLegend = (props) => {
  const {payload}  = props;
  return (
    <ul className="custom-legend">
      {payload.reverse().map((entry, index) => (
          <li key={index}>
            <span className="color" style={{backgroundColor: entry.color}}></span>
            {genderToTooltipTextObj[entry.value]}
          </li>
        ))
      }
    </ul>
  )
}

let computeBarchartData = (data) => {
  if (!data) return null;
  var barchartData = [
    { age: "0-10", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "11-20", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "21-30", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "31-40", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "41-50", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "51-60", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "61-70", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "71-80", male: 0, female: 0, other: 0, notSay: 0 },
    { age: "81-90", male: 0, female: 0, other: 0, notSay: 0 },
    { age: ">90", male: 0, female: 0, other: 0, notSay: 0 }
  ];
  data.map(function (value, i) {
    /*
      exclude values where age_group is not specified
      and exclude votes with people age > 100 year (age_group=0)
    */
    if (!value.age_group || value.age_group == 0) return;
    let index = 10 - value.age_group;
    let gender = (value.gender == 1 && "male") || (value.gender == 2 && "female") || (value.gender == 3 && "other") || (value.gender == 0 && "notSay");
    barchartData[index][gender] += value.id__count;
  })
  return barchartData;
}

export default AgeProfileBarchart;
