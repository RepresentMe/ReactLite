import React from 'react';
import { observer } from "mobx-react";
import {ResponsiveContainer, PieChart, Pie, Sector, Legend} from 'recharts';
import LoadingIndicator from '../../LoadingIndicator';

const PIE_HEIGHT = 300;

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, percent, name, value, zeroChoices, full_name, direct_vote_count } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 2;
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
      {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/> */}
      {/* <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/> */}
      <text x={ex + (cos >= 0 ? 1 : -1)} y={ey} textAnchor={textAnchor} fill={fill} style={{fontSize: 12}}>
        {`${(percent * 100).toFixed(1)}%`}
      </text>
      <text x={cx} y={30} textAnchor='middle' fill={fill}>{full_name}</text>
      <text x={cx} y={30} dy={18} textAnchor='middle' fill="#999" style={{fontSize: 12}}>
        {`Rate ${(percent * 100).toFixed(1)}%`}
      </text>
      <text x={cx} y={30} dy={36} textAnchor='middle' fill="#999" style={{fontSize: 12}}>
        {`${direct_vote_count} people`}
      </text>
      {/* {zeroChoices &&
        zeroChoices.map((choice, i) => (
            <text key={`txt-${i}`} x={50} y={300} dy={18*i} textAnchor='start' fill="#404040">{`${choice.text}: 0%`}</text>
          ))
      } */}

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
    const WIDTH = window.innerWidth;
    const HEIGHT = 400;

  	return (
      <div>
        {!this.props.data && <LoadingIndicator />}
        {this.props.data &&
        	<PieChart width={WIDTH} height={HEIGHT} onMouseEnter={this.onPieEnter}>
            <Pie
            	activeIndex={this.state.activeIndex}
              activeShape={renderActiveShape}
              data={this.props.data['values']}
              cx={WIDTH*0.5}
              cy={HEIGHT*0.5}
              innerRadius={55}
              outerRadius={80}
              fill="#8884d8"/>
            <Legend width={WIDTH*0.9} align='center' wrapperStyle={{ bottom: 10, left: 10, fontSize: 10, backgroundColor: 'transparent', border: 'none', lineHeight: '10px', padding: 10}} />
         </PieChart>}
      </div>
    );
  }
})

export default TwoLevelPieChart;
