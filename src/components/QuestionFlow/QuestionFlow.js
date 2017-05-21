import React, { Component } from 'react'
import { observer, inject } from "mobx-react"

import {Tabs, Tab} from 'material-ui/Tabs'
import DonutSmall from 'material-ui/svg-icons/action/donut-small'
import InsertComment from 'material-ui/svg-icons/editor/insert-comment'
import Share from 'material-ui/svg-icons/social/share'
import CheckBox from 'material-ui/svg-icons/toggle/check-box'
import Info from 'material-ui/svg-icons/action/info'

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
  },
  tabsContentContainerStyle: {
    height: 'calc(100% - 64px)',
    position: 'relative',
    overflowX: 'hidden',
    overflowY: 'scroll',
    paddingTop: '20px'
  },
  tabTemplateStyle: {
    height: '100%'
  },
  middleDivWrapper: {
    display: 'table',
    width: '100%',
    height: '70vh',
    overflow: 'hidden'
  }
}


@inject("QuestionStore")
class QuestionFlow extends Component {

  constructor(props) {
    super(props)

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
    const hideInfoTab = (currentQuestion && currentQuestion.description) === '' && !currentQuestion.links.length
    const { tabsContentContainerStyle, tabTemplateStyle } = styles

    return (
         <div style={tabTemplateStyle} className="tabs-wrapper">
          <Tabs value={activeTab}
                onChange={this.handleTabChange}
                tabItemContainerStyle={styles.tabItemContainerStyle}
                inkBarStyle={styles.inkBarStyle}
                style={tabTemplateStyle}
                tabTemplateStyle={tabTemplateStyle}
                contentContainerStyle={tabsContentContainerStyle}>
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
            { !hideInfoTab && <Tab icon={<Info/>} value="info" className={activeTab === 'info' ? 'menu-tab-active' : 'menu-tab'}>
              {
                (activeTab === 'info') &&
                  <QuestionFlowInfo question={currentQuestion}/>
              }
            </Tab>
            }
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

export default QuestionFlow
