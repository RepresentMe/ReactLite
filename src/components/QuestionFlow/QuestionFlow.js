import React, { Component } from 'react'
import { observer, inject } from "mobx-react"
import moment from 'moment'

import {Tabs, Tab} from 'material-ui/Tabs'
import DonutSmall from 'material-ui/svg-icons/action/donut-small'
import InsertComment from 'material-ui/svg-icons/editor/insert-comment'
import Share from 'material-ui/svg-icons/social/share'
import CheckBox from 'material-ui/svg-icons/toggle/check-box'
import Info from 'material-ui/svg-icons/action/info'
import { grey100, cyan600, white, blue500, red500, greenA200 } from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

import Left from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import Right from 'material-ui/svg-icons/hardware/keyboard-arrow-right';


import QuestionFlowComments from '../QuestionFlowComments';
import QuestionFlowInfo from '../QuestionFlowInfo';
import QuestionFlowShare from '../QuestionFlowShare';
import QuestionFlowResults from '../QuestionFlowResults';
import QuestionFlowVote from '../QuestionFlowVote';

import './QuestionFlow.css'

const styles = {
  hiddenIcon: {
    display: 'none'
  },
  icon: {
    width:'50px',
    height: '50px'
  },
  inkBarStyle: {
    display: 'none'
  }
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
         <div style={{height: '100%'}} className="tabs-wrapper">
          <Tabs value={activeTab} onChange={this.handleTabChange} tabItemContainerStyle={styles.tabItemContainerStyle} inkBarStyle={styles.inkBarStyle} style={{height: '100%'}} tabTemplateStyle={{height: '100%'}} contentContainerStyle={{height: 'calc(100% - 48px)', position: 'relative', overflow: 'scroll'}}>
            <Tab icon={<CheckBox/>} value="vote" className={activeTab === 'vote' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'vote') &&
                  <QuestionFlowVote items={items} 
                    index={currentItemIndex} 
                    onVote={onVote} 
                    navigateNext={navigateNext} 
                    getNextQuestion={this.getNextQuestion} 
                    getPrevQuestion={this.getPrevQuestion} 
                    currentQuestion={currentQuestion}
                  />
              }
            </Tab>
            <Tab icon={<InsertComment/>} value="comments" className={activeTab === 'comments' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'comments') &&
                  <QuestionFlowComments question={QuestionStore.questions.get(currentItem.object_id)} />
              }
              
            </Tab>
            <Tab icon={<Info/>} value="info" className={activeTab === 'info' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'info') &&
                  <QuestionFlowInfo question={currentQuestion}/>
              }
            </Tab>
            <Tab icon={<DonutSmall/>} value="results" className={activeTab === 'results' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'results') &&
                  <QuestionFlowResults question={currentQuestion} type={currentItem.type} />
              }
            </Tab>
            <Tab icon={<Share/>} value="share" className={activeTab === 'share' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'share') &&
                  <QuestionFlowShare question={QuestionStore.questions.get(currentItem.object_id)} />
              }
            </Tab>
          </Tabs>
        </div>
    )
  }

}


const MiddleDiv = ({children}) => (
  <div style={{ display: 'table', width: '100%', height: '70vh', overflow: 'scroll' }}>
    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
      {children}
    </div>
  </div>
)

// const QuestionFlowVote = ({items, index, onVote, navigateNext, getNextQuestion, getPrevQuestion, currentQuestion}) => {
//   console.log('QuestionFlowVote')
//   const item = items[index];
//   const { hiddenIcon, icon } = styles
//   const showAnswered = !!currentQuestion.my_vote.length
//   return (
//     <div style={{height: '100%'}}>
//       <div className="answering-mode-wrapper">Answering <a>privately</a></div>
//       {
//         showAnswered && 
//           <div className="answered">
//             Answered on {moment(currentQuestion.my_vote[0].modified_at).format('DD MMM')}. Click again to change or confirm
//           </div>
//       }
//       { <CSSTransitionGroup
//         transitionName="FlowTransition"
//         transitionAppear={true}
//         transitionEnterTimeout={1000}
//         transitionLeaveTimeout={1000}
//       > }
//         {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={onVote} key={"FlowTransition" + index}/>}
//         {item.type === "B" && <RenderedBreak title={item.content_object.title} text={item.content_object.text} onContinue={navigateNext}/>}
//       {/* </CSSTransitionGroup> */}

//       <div className="nav-buttons">
//         <div>
//           <Left style={ (index < 1) ? hiddenIcon : icon } onClick={getPrevQuestion}/>
//         </div>
//         <div>
//           <Right style={Object.assign(icon, { marginRight:'5px' })} onClick={getNextQuestion}/>
//         </div>
//       </div>

//     </div>
//   )
// }

export default QuestionFlow
