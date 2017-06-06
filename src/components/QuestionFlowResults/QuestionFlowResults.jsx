import React, {Component} from 'react'
import { observer } from 'mobx-react'
import { observable } from 'mobx'

import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart';

import IconButton from 'material-ui/IconButton';

import ChartPie from 'mdi-react/ChartPieIcon';
import MapMarker from 'mdi-react/MapMarkerIcon';
import AccountMultiple from 'mdi-react/AccountMultipleIcon';
import RaisedButton from 'material-ui/RaisedButton';

import './QuestionFlowResults.css'

@observer
class QuestionFlowResults extends Component {

  showingTabIndex = observable("pie"); // bar, map, people
  constructor() {
    super(...arguments)

    // this.state = {
    //   pie: false
    // }
  }

  changeGraph = (type) => {
    this.showingTabIndex.set(type)
    // const pieChart = type === "bar" ? false : true;

    // if (this.state.pie != pieChart)
    //   this.setState({pie: pieChart})
  }

  render() {
    const { question, type } = this.props;
    if(type === "B") {
      return null
    }
    const curTab = this.showingTabIndex.get();
    return (
      <div>
        <div className="buttonBoxing">
          <IconButton onClick={e => this.changeGraph("people")} touch={true} tooltipPosition="top-center" className={curTab === 'people' ? "buttonBorder selectedButton" : "buttonBorder"}>
            <AccountMultiple className={curTab === 'people' ? "selectedButton" : ""} />
          </IconButton>
          <IconButton onClick={e => this.changeGraph("pie")} className={curTab === 'pie' ? "buttonBorder selectedButton" : "buttonBorder"}>
            <ChartPie className={curTab === 'pie' ? "selectedButton" : ""}/>
          </IconButton>
          <IconButton onClick={e => this.changeGraph("map")} touch={true} tooltipPosition="top-center"  className={curTab === 'map' ? "buttonBorder selectedButton" : "buttonBorder"}>
            <MapMarker className={curTab === 'map' ? "selectedButton" : ""} />
          </IconButton>
        </div>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div style={{flex: 1}}>
            {(curTab === 'pie' || curTab === 'bar') && <QuestionLiquidPiechart questionId={question.id} pie={curTab === 'pie'}/>}
            {(curTab === 'map' || curTab === 'people') && <PlaceholderScreen tab={this.showingTabIndex} question={question} />}
          </div>
        </div>


      </div>
    )
  }
}

const PlaceholderScreen = observer(({tab, question}) => {
  return (<div>
    <div style={{display:'block', maxWidth: '350px', margin:'0 auto', textAlign: 'center'}}>
      <img style={{maxWidth: 350, border: '1px solid #ccc'}} src={tab.get() === 'map' ?'https://d2ppvlu71ri8gs.cloudfront.net/items/3i3K071k3Q1e0j1A3e2R/Screen%20Shot%202017-05-16%20at%2013.15.45.png?v=d446acf2' : 'https://d2ppvlu71ri8gs.cloudfront.net/items/1m3Q3U3o02263K04470G/Image%202017-05-16%20at%201.13.37%20pm.png?v=3c947268'} />
      <p style={{margin:'30px 0 0 0', color: '#999', fontSize: 13}}>This feature isn't available just here (yet!) but you can still see the result looking something like the image above over at the main site.</p>
      <RaisedButton label="Let's see it!" style={{margin: '40px 0 20px'}} backgroundColor="#1B8AAE" href={`https://app.represent.me/question/${question.id}/${question.slug}/`} />
    </div>
  </div>)
})

export default QuestionFlowResults
