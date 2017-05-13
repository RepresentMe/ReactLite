import React, {Component} from 'react'

import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart';
import QuestionResultsBarchart from '../charts/QuestionResultsBarchart';
import IconButton from 'material-ui/IconButton';
import ChartBar from 'mdi-react/ChartBarIcon';
import ChartPie from 'mdi-react/ChartPieIcon';
import MapMarker from 'mdi-react/MapMarkerIcon';
import AccountMultiple from 'mdi-react/AccountMultipleIcon';

import './QuestionFlowResults.css'

class QuestionFlowResults extends Component {

  constructor() {
    super(...arguments)

    this.state = {
      pie: true
    }
  }

  changeGraph = (type) => {
    const pieChart = type === "bar" ? false : true;

    if (this.state.pie != pieChart)
      this.setState({pie: pieChart})
  }

  render() {
    console.log('QuestionFlowResults')
    if(this.props.type === "B") {
      return null
    }
    return (
      <div>
        <QuestionLiquidPiechart questionId={this.props.question.id} pie={this.state.pie}/>
        <div className="buttonBoxing">
          <IconButton tooltip="Coming soon" touch={true} tooltipPosition="top-center" className="buttonBorder">
            <AccountMultiple />
          </IconButton>
          <IconButton onClick={e => this.changeGraph("bar")} className={!this.state.pie ? "buttonBorder selectedButton" : "buttonBorder"}>
            <ChartBar className={!this.state.pie ? "selectedButton" : ""}/>
          </IconButton>
          <IconButton onClick={e => this.changeGraph("pie")} className={this.state.pie ? "buttonBorder selectedButton" : "buttonBorder"}>
            <ChartPie className={this.state.pie ? "selectedButton" : ""}/>
          </IconButton>
          <IconButton tooltip="Coming soon" touch={true} tooltipPosition="top-center" className="buttonBorder">
            <MapMarker />
          </IconButton>
        </div>
      </div>
    )
  }
}

export default QuestionFlowResults