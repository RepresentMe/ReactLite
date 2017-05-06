import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { observer, inject } from "mobx-react"
import $ from 'jquery'
import ReactMarkdown from 'react-markdown';

import {Tabs, Tab} from 'material-ui/Tabs'
import DonutSmall from 'material-ui/svg-icons/action/donut-small'
import InsertComment from 'material-ui/svg-icons/editor/insert-comment'
import Share from 'material-ui/svg-icons/social/share'
import CheckBox from 'material-ui/svg-icons/toggle/check-box'
import Info from 'material-ui/svg-icons/action/info'
import { grey100, cyan600, white } from 'material-ui/styles/colors';
import Slider from 'material-ui/Slider';
import RaisedButton from 'material-ui/RaisedButton';

import QuestionFlowComments from '../QuestionFlowComments';
import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart'
import './QuestionFlow.css'

@inject("QuestionStore")
class QuestionFlow extends Component {

  constructor() {
    super()

    this.sliderChange = this.sliderChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  render() {
    let {items, currentItemIndex, onVote, navigateN, activeTab, navigateNext, QuestionStore} = this.props
    currentItemIndex = parseInt(currentItemIndex)

    if(!items) {
      return null;
    }

    let currentItem = items[currentItemIndex];

    return (
      <QuestionFlowTabLayout activeTab={activeTab} handleTabChange={this.handleTabChange}>
        {this.props.activeTab === 'vote' && <QuestionFlowVote items={items} index={currentItemIndex} onVote={onVote} sliderChange={(n) => navigateN(n)} navigateNext={navigateNext}/>}
        {this.props.activeTab === 'results' && <QuestionFlowResults item={currentItem}/>}
        {this.props.activeTab === 'comments' && <QuestionFlowComments question={QuestionStore.questions.get(currentItem.object_id)}/>}
      </QuestionFlowTabLayout>
    )
  }

  componentDidMount() {
    questionTextFix(this.props.currentItemIndex);
  }

  componentDidUpdate() {
    questionTextFix(this.props.currentItemIndex);
  }

  sliderChange(n) {
    this.props.navigateN(n)
  }

  handleTabChange(value) {
    this.props.navigateTab(value)
  }

}

const QuestionFlowResults = ({item}) => {

  if(item.type === "B") {
    return null
  }

  return (
    <QuestionLiquidPiechart questionId={item.object_id} />
  )
}

const QuestionFlowTabLayout = ({children, handleTabChange, activeTab}) => {

  let styles = {
    headline: {
      fontSize: 24,
      paddingTop: 16,
      marginBottom: 12,
      fontWeight: 400,
    },
    tabItemContainerStyle: {
      backgroundColor: grey100
    },
    inkBarStyle: {
      backgroundColor: cyan600
    }
  };

  return (
    <div style={{height: '100%'}}>
      <Tabs value={activeTab} onChange={handleTabChange} tabItemContainerStyle={styles.tabItemContainerStyle} inkBarStyle={styles.inkBarStyle} style={{height: '100%'}} tabTemplateStyle={{height: '100%'}} contentContainerStyle={{height: 'calc(100% - 48px)', position: 'relative', overflow: 'scroll'}}>
        <Tab icon={<CheckBox/>} value="vote">
          {children}
        </Tab>
        <Tab icon={<InsertComment/>} value="comments">
          {children}
        </Tab>
        <Tab icon={<Info/>} value="info">
          {children}
        </Tab>
        <Tab icon={<DonutSmall/>} value="results">
          {children}
        </Tab>
        <Tab icon={<Share/>} value="share">
          {children}
        </Tab>
      </Tabs>
    </div>
  )
}

const MiddleDiv = ({children}) => (
  <div style={{ display: 'table', width: '100%', height: '100vh', overflow: 'scroll' }}>
    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
      {children}
    </div>
  </div>
)

const QuestionFlowVote = ({items, index, onVote, sliderChange, navigateNext}) => {
  let item = items[index];

  return (
    <div style={{height: '100%', overflow: 'scroll'}}>
      <CSSTransitionGroup
        transitionName="FlowTransition"
        transitionAppear={true}
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
      >
        {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={onVote} key={"FlowTransition" + index}/>}
        {item.type === "B" && <RenderedBreak title={item.content_object.title} text={item.content_object.text} onContinue={navigateNext}/>}
      </CSSTransitionGroup>
      <SlideNavigation key="SlideNavigation" items={items} onChange={sliderChange} value={index}/>
    </div>
  )
}

const RenderedQuestion = inject("QuestionStore")(observer(({QuestionStore, id, index, onVote}) => {

  let {question, my_vote, subtype, choices} = QuestionStore.questions.get(id)

  let myVote = null;
  if(my_vote.length > 0 && subtype === 'likert') {myVote = my_vote[0].value}
  if(my_vote.length > 0 && subtype === 'mcq') {myVote = my_vote[0].object_id}

  return (
    <MiddleDiv>
      <h1 className={"questionTextFix-" + index}>{question}</h1>
      {subtype === "likert" && <LikertButtons value={myVote} onVote={onVote}/>}
      {subtype === "mcq" && <MCQButtons value={myVote} onVote={onVote} choices={choices}/>}
    </MiddleDiv>
  )

}))

const RenderedBreak = ({title, text, onContinue}) => (
  <MiddleDiv>
    <h1>{ title }</h1>
    <ReactMarkdown source={ text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>
    <RaisedButton label="Continue" onClick={onContinue} primary />
  </MiddleDiv>
)


const LikertButtons = ({value, onVote}) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div
      className={ "likertButton likertButton" + i + ( value && value !== i ? " likertButtonDimmed" : "")}
      key={i}
      onTouchTap={() => onVote(i)}></div>);
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto', marginBottom: '60px'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

const MCQButtons = ({choices, value, onVote}) => (
  <div style={{paddingBottom: '50px'}}>
    {choices.map((choice, index) => {
      let activeMCQ = value === choice.id ? 'activeMCQ' : '';
      return (
        <div key={`p-${index}`} className={`mcqButton ${activeMCQ}`} onTouchTap={() => onVote(choice.id)}>{choice.text}</div>
      );
    })}
  </div>
)

class SlideNavigation extends Component {

  constructor() {
    super();
    this.state = {value: 0,}
    this.onDragStop = this.onDragStop.bind(this)
  }

  componentWillMount() {
    this.setState({value: this.props.value})
  }

  render() {
    let max = this.props.items.length

    return (
      <div style={{position: 'absolute', bottom: '0', width: '80%', padding: '0 10%', background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%)'}}>
        <p style={{textAlign: 'center'}}>{(this.state.value + 1)} / {max}</p>
        <Slider style={{backgroundColor: grey100, width: '100%', pointerEvents: "all"}}
          sliderStyle={{backgroundColor: white, color: cyan600, margin: "0"}}
          max={max}
          min={0}
          value={this.state.value}
          step={1}
          onDragStop={this.onDragStop}
          onChange={(e, value) => this.setState({value})}
        />
      </div>
    )
  }

  onDragStop() {
    this.props.onChange(this.state.value)
  }

}

const questionTextFix = (key = "") => {
  let target = $('.questionTextFix-' + key);
  while(target.height() * 100 / $(document).height() > 20) {
    target.css('font-size', (parseInt(target.css('font-size')) - 1) + 'px')
  }
}

export default QuestionFlow
