import React from 'react';
import { observer } from "mobx-react";
import {ResponsiveContainer, PieChart, Pie, Sector, Legend} from 'recharts';

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, percent, name, value, zeroChoices, direct_vote_count } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} style={{fontSize: 12}}>{name}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill={fill}>{name}</text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
        {`Rate ${(percent * 100).toFixed(2)}%`}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={36} textAnchor={textAnchor} fill="#999">{`Direct vote count: ${direct_vote_count}`}</text>
      {zeroChoices &&
        zeroChoices.map((choice, i) => (
            <text key={`txt-${i}`} x={50} y={300} dy={18*i} textAnchor='start' fill="#404040">{`${choice.text}: 0%`}</text>
          ))
      }

    </g>
  );
};


const TwoLevelPieChart = observer(class TwoLevelPieChart extends React.Component{

	state= {
      activeIndex: 0,
    };

  onPieEnter = (data, index) =>
    this.setState({
      activeIndex: index,
    });

	render () {
    const CX = 350;
    const CY = 150;

  	return (
      	<PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
          <Pie
          	activeIndex={this.state.activeIndex}
            activeShape={renderActiveShape}
            data={this.props.data['values']}
            cx={CX}
            cy={CY}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"/>
          <Legend width={CX*2} align='left' wrapperStyle={{ bottom: 10, left: 10, backgroundColor: '#f5f5f5', border: '1px solid #d5d5d5', borderRadius: 3, lineHeight: '30px', padding: 10}} />
         </PieChart>

    );
  }
})

export default TwoLevelPieChart;
