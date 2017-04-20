import React from 'react';
import { observer } from "mobx-react";
import {PieChart, Legend, Pie, Tooltip, ResponsiveContainer} from 'recharts';
import LoadingIndicator from '../../LoadingIndicator';

const PIE_HEIGHT = 400;
const PIE_WIDTH = 600;

const CustomTooltip = (props) => {
  const { active } = props;
  if (active) {
    const { payload } = props;
    return (
      <div style={{backgroundColor: '#f5f5f5', opacity: 0.8, padding: 5, borderRadius: 5}}>
        <p>{`${payload[0].payload.full_name}: ${Math.round(payload[0].percent*100)}%`}</p>
        <p>{`Direct vote count: ${payload[0].payload.direct_vote_count}`}</p>
      </div>
    );
  }
  return null;
};


const OneLevelPiechartComponent = observer(({data}) => {

  const RADIAN = Math.PI / 180;
  const CX = 350;
  const CY = 150;

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, prev, outerRadius, value, fill, payload, percent, index, data_length }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 1.45;
    const x  = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy  + radius * Math.sin(-midAngle * RADIAN);


//{x > cx*1.2 ? y+20-8*index : y}
    return (
      <text x={x} y={prev < 3 ? y+16-8*index : y} fill={fill} style={{fontSize: 14}} textAnchor={x > cx ? 'start' : 'end'} 	dominantBaseline="text-after-edge">
        {`${payload.name}: ${(percent * 100).toFixed(0)}%`}
      </text>
      );
    };

	return (
    <div>
      {!data && <LoadingIndicator />}
      {data && <ResponsiveContainer minHeight={PIE_HEIGHT} minWidth={PIE_WIDTH}>
      	<PieChart
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>

          <Pie
            data={data.values}
            labelLine={true}
            label={renderCustomizedLabel}
            innerRadius={40}
            outerRadius={80}
            fill="#8884d8"
            cx={CX}
            cy={CY}
          >
          </Pie>
          <Tooltip coordinate={{ x: 100, y: 140 }} content={<CustomTooltip/>}/>
          {/* <Legend width={PIE_WIDTH} align='left' wrapperStyle={{ bottom: 10, left: 10, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '30px', padding: 10}} /> */}
        </PieChart>

      </ResponsiveContainer>}
    </div>
    );
  })
export default OneLevelPiechartComponent;
