import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { observer, inject } from "mobx-react"
import $ from 'jquery'

import {Tabs, Tab} from 'material-ui/Tabs'
import DonutSmall from 'material-ui/svg-icons/action/donut-small'
import InsertComment from 'material-ui/svg-icons/editor/insert-comment'
import Share from 'material-ui/svg-icons/social/share'
import CheckBox from 'material-ui/svg-icons/toggle/check-box'
import Info from 'material-ui/svg-icons/action/info'
import { grey100, cyan600 } from 'material-ui/styles/colors';

import './QuestionFlow.css'

class QuestionFlow extends Component {

  constructor() {
    super()

    this.state = {
      activeTab: 'vote',
    }
  }

  componentWillMount() {

  }

  render() {
    let {items, currentItemIndex, onVote} = this.props

    if(!items) {
      return null;
    }

    let currentItem = items[currentItemIndex];

    return (
      <QuestionFlowTabLayout>
        {this.state.activeTab === 'vote' && <QuestionFlowVote item={currentItem} index={currentItemIndex} onVote={onVote}/>}
      </QuestionFlowTabLayout>
    )
  }

  componentDidMount() {
    questionTextFix(this.props.currentItemIndex);
  }

  componentDidUpdate() {
    questionTextFix(this.props.currentItemIndex);
  }

}

const QuestionFlowTabLayout = ({children}) => {

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
      <Tabs tabItemContainerStyle={styles.tabItemContainerStyle} inkBarStyle={styles.inkBarStyle} style={{height: '100%'}} tabTemplateStyle={{height: '100%'}} contentContainerStyle={{height: 'calc(100% - 48px)', position: 'relative'}}>
        <Tab icon={<CheckBox/>}>
          {children}
        </Tab>
        <Tab icon={<InsertComment/>}>
          {children}
        </Tab>
        <Tab icon={<Info/>}>
          {children}
        </Tab>
        <Tab icon={<DonutSmall/>}>
          {children}
        </Tab>
        <Tab icon={<Share/>}>
          {children}
        </Tab>
      </Tabs>
    </div>
  )
}

const MiddleDiv = ({children}) => (
  <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute', overflow: 'hidden' }}>
    <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
      {children}
    </div>
  </div>
)

const QuestionFlowVote = ({item, index, onVote}) => {
  return (
    <CSSTransitionGroup
      transitionName="FlowTransition"
      transitionEnterTimeout={1000}
      transitionLeaveTimeout={1000}
    >
      {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={onVote}/>}
      {/*item.type === "B" && */}
    </CSSTransitionGroup>
  )
}

const RenderedQuestion = inject("QuestionStore")(observer(({QuestionStore, id, index, onVote}) => {

  let {question, my_vote, subtype} = QuestionStore.questions.get(id)

  let myVote = null;
  if(my_vote.length > 0) {myVote = my_vote[0].value}

  return (
    <MiddleDiv>
      <h1 className={"questionTextFix-" + index}>{question}</h1>
      {subtype === "likert" && <LikertButtons onUpdate={null} value={myVote} onVote={onVote}/>}
      {subtype === "mcq" && <MCQButtons onUpdate={null} question={question} onVote={onVote}/>}
    </MiddleDiv>
  )

}))

// const RenderedBreak = (props) => {
//   return(
//     <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
//       <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0px 20px 40px 20px' }}>
//         <h1>{ props.break.title }</h1>
//         <ReactMarkdown source={ props.break.text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>
//         <RaisedButton label="Continue" onClick={props.onContinue} primary />
//       </div>
//     </div>  )
// }

let LikertButtons = inject("QuestionStore")(observer(({QuestionStore, value, onVote}) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div
      className={ "likertButton likertButton" + i + ( value && value !== i ? " likertButtonDimmed" : "")}
      key={i}
      onTouchTap={() => onVote(i)}></div>);
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto'}}>{likertJSX.map((item, index) => {return item})}</div>);
}))

const MCQButtons = (props) => {
  return (
    <div style={{paddingBottom: '40px'}}>
      {props.question.choices.map((choice, index) => {
        let activeMCQ = props.question.my_vote[0] && props.question.my_vote[0].object_id === choice.id ? 'activeMCQ' : '';
        return (
          <div
            key={`p-${index}`}
            className={`mcqButton ${activeMCQ}`}
            onTouchTap={() => props.onUpdate(choice.id)}
          >
            {choice.text}
          </div>
      );
      })}
    </div>
  )
}

const questionTextFix = (key = "") => {
  let target = $('.questionTextFix-' + key);
  while(target.height() * 100 / $(document).height() > 20) {
    target.css('font-size', (parseInt(target.css('font-size')) - 1) + 'px')
  }
}

export default QuestionFlow
