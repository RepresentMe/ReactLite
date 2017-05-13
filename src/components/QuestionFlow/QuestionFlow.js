import React, { Component } from 'react'
import { observer, inject } from "mobx-react"
import $ from 'jquery'
import ReactMarkdown from 'react-markdown';
import FlatButton from 'material-ui/FlatButton';

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
import QuestionFlowInfo from '../QuestionFlowInfo';
import QuestionFlowShare from '../QuestionFlowShare';
import QuestionFlowResults from '../QuestionFlowResults';

import './QuestionFlow.css'

const hiddenBtn ={
  display: 'none'
}

@inject("QuestionStore")
class QuestionFlow extends Component {

  constructor() {
    super()

    this.sliderChange = this.sliderChange.bind(this)
    this.handleTabChange = this.handleTabChange.bind(this)

    this.getNextQuestion = this.getNextQuestion.bind(this)
    this.getPrevQuestion = this.getPrevQuestion.bind(this)
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

  getNextQuestion() {
    const { currentItemIndex } = this.props
    this.props.navigateN(parseInt(currentItemIndex) + 1)
  }

  getPrevQuestion() {
    const { currentItemIndex } = this.props
    this.props.navigateN(parseInt(currentItemIndex) - 1)
  }

  render() {
    let { items, currentItemIndex, onVote, activeTab, navigateNext, QuestionStore } = this.props
    currentItemIndex = parseInt(currentItemIndex)

    if(!items) {
      return null;
    }

    const currentItem = items[currentItemIndex];
    const currentQuestion = QuestionStore.questions.get(currentItem.object_id);

    return (
      <QuestionFlowTabLayout activeTab={activeTab} handleTabChange={this.handleTabChange}>
          {this.props.activeTab === 'vote' && <QuestionFlowVote items={items} index={currentItemIndex} onVote={onVote} navigateNext={navigateNext} getNextQuestion={this.getNextQuestion} getPrevQuestion={this.getPrevQuestion} />}
          {this.props.activeTab === 'results' && <QuestionFlowResults question={currentQuestion} type={currentItem.type} />}
          {this.props.activeTab === 'comments' && <QuestionFlowComments question={QuestionStore.questions.get(currentItem.object_id)} />}
          {this.props.activeTab === 'info' && <QuestionFlowInfo question={currentQuestion}/>}
          {this.props.activeTab === 'share' && <QuestionFlowShare question={QuestionStore.questions.get(currentItem.object_id)} />}
        </QuestionFlowTabLayout>
    )
  }

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
    <div style={{height: '100%'}} className="tabs-wrapper">
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
  <div style={{ display: 'table', width: '100%', height: '70vh', overflow: 'scroll' }}>
    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
      {children}
    </div>
  </div>
)

const QuestionFlowVote = ({items, index, onVote, navigateNext, getNextQuestion, getPrevQuestion}) => {
  const item = items[index];

  return (
    <div style={{height: '100%', overflow: 'scroll'}}>
      {/* <CSSTransitionGroup
        transitionName="FlowTransition"
        transitionAppear={true}
        transitionEnterTimeout={1000}
        transitionLeaveTimeout={1000}
      > */}
        {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={onVote} key={"FlowTransition" + index}/>}
        {item.type === "B" && <RenderedBreak title={item.content_object.title} text={item.content_object.text} onContinue={navigateNext}/>}
      {/* </CSSTransitionGroup> */}

      <div className="nav-buttons">
        <div><FlatButton style={(index > 0) ? {} : hiddenBtn} label="Prev" onClick={getPrevQuestion}/></div>
        <div><FlatButton label="Next" onClick={getNextQuestion}/></div>
      </div>

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

const questionTextFix = (key = "") => {
  let target = $('.questionTextFix-' + key);
  while(target.height() * 100 / $(document).height() > 20) {
    target.css('font-size', (parseInt(target.css('font-size')) - 1) + 'px')
  }
}

export default QuestionFlow
