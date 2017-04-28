import React from 'react';
import { observer } from "mobx-react";
import LoadingIndicator from '../../LoadingIndicator';
import './barStyle.css';

const CHART_HEIGHT = 350;

const BarChartComponent = observer(({data}) => {

	return (
    <div>
      {!data.values && <LoadingIndicator />}
      {data.values &&
        <div style={{maxHeight: CHART_HEIGHT}}>
        {
          data.values.map((d, i) => {
            return (
              <div key={`bar-${i}`} >
                <ContainerBar {...d}/>
              </div>
            )
          })
        }
      </div>}
    </div>
    );
  })

const ContainerBar = (props) => {
	return (
		<div className='bg_bar'>
		    <Bar {...props}/>
		    <Percentage {...props}/>
		</div>
)}

class Bar extends React.Component {
  state={
    activeId: '',
		direct_vote_count: ''
  }
  handleMouseEnter = (e) => {
    this.setState({activeEltIndex: this.props.name})
		this.setState({direct_vote_count: this.props.direct_vote_count})
  }
	handleMouseLeave = (e) => {
		this.setState({activeEltIndex: '', direct_vote_count: ''})
	}
  render(){
		const width = Math.round(this.props.percentage*0.7*window.innerWidth/100)
	  const style = Object.assign({}, {
	      backgroundColor: this.props.fill,
	      width: this.state.activeEltIndex ? width*1.1 : width
	      })
		const display = this.state.direct_vote_count && window.innerWidth > 800 ?
			`${this.props.full_name}....Direct vote count: ${this.state.direct_vote_count}` :
			this.props.full_name

		return (
		  <div className='bar'
				title={`Direct vote count: ${this.props.direct_vote_count}`}
		    style={style}
		    onMouseEnter={this.handleMouseEnter}
				onMouseLeave={this.handleMouseLeave}
		    >
		     {display}
		  </div>
)}}

const Percentage = (props) => (
  <div className='percentage' style={{color: props.fill}}>
		{`${props.percentage}%`}
	</div>
)

export default BarChartComponent;
