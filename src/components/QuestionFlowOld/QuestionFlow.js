import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router-dom';
import Tappable from 'react-tappable';
import $ from 'jquery';
import LoadingIndicator from '../LoadingIndicator';
import { FacebookButton, TwitterButton } from "react-social";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import Slider from 'material-ui/Slider';
import LinearProgress from 'material-ui/LinearProgress';
import { white, cyan600, grey300, grey600, indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import ReactMarkdown from 'react-markdown';
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import IconButton from 'material-ui/IconButton';

import CompleteProfile from './CompleteProfile';
import ErrorReload from '../ErrorReload';
import DynamicConfigService from '../../services/DynamicConfigService';

import './QuestionFlow.css';

//let QuestionFlow = inject("CollectionStore", "QuestionStore", "UserStore")(observer(({ history, UserStore, CollectionStore, QuestionStore, match }) => {

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

@inject("CollectionStore", "QuestionStore", "UserStore") @observer class QuestionFlow extends Component {

  constructor() {
    super()
    this.state = {
      collection: null,
      collectionItems: null,
      networkError: false,
      private: true,
    }

    this.togglePrivate = this.togglePrivate.bind(this)
    this.questionShareLink = this.questionShareLink.bind(this)
  }

  componentWillMount() {
    let { CollectionStore, match } = this.props
    CollectionStore.getCollectionById(parseInt(match.params.collectionId))
      .then((collection) => {
        this.setState({collection})
      })
      .catch((error) => {
        this.setState({networkError: true})
      })

    CollectionStore.getCollectionItemsById(parseInt(match.params.collectionId))
      .then((collectionItems) => {
        this.setState({collectionItems})
      })
      .catch((error) => {
        this.setState({networkError: true})
      })

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
    this.setState({private: !this.dynamicConfig.config.question_flow.default_public})
  }

  render() {

    let { history, UserStore, CollectionStore, QuestionStore, match } = this.props;
    let { collection, collectionItems, networkError } = this.state;

    if(networkError) {
      return <ErrorReload message="We couldn't load this collection!"/>
    }else if(!collection || collectionItems === null) {
      return <LoadingIndicator/>
    }

    let collectionId = parseInt(match.params.collectionId);
    let orderNumber = parseInt(match.params.orderNumber);

    let item = collectionItems[orderNumber];

    if(!item) {
      this.navigateToEnd()
      return null;
    }

    return (
      <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'scroll' }}>

        <ProgressIndicator link={this.questionShareLink()} togglePrivate={this.togglePrivate} private={this.state.private} key={"PROGRESS_SLIDER"} order={orderNumber} max={collectionItems.length} style={{ position: 'fixed', bottom: '25px', width: '100%', left: '0', padding: '20px 20px 10px 20px', boxSizing: 'border-box', background: "linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%)", height: '110px', zIndex: 200, pointerEvents: "none"}} onChange={(event, value) => {
          if( value < collectionItems.length ) { // If there is a next question
            this.navigateToItem(value)
          }else {
            this.navigateToEnd()
          }
        }}/>

        {(item.type === "Q" && QuestionStore.questions.get(item.object_id).my_vote.length > 0) &&
          <Paper style={{textAlign: 'center', padding: '5px 0', backgroundColor: cyan600, color: white, position: 'fixed', width: '100%', zIndex: 100}} zDepth={1}>
            {"You answered this in " + monthNames[new Date(QuestionStore.questions.get(item.object_id).my_vote[0].modified_at).getMonth()] + ". Have you changed your mind? "}
            <div className="FakeLink" style={{color: "white"}} onClick={() => history.push('/survey/' + collectionId + '/flow/' + (orderNumber + 1))}>Skip &raquo;</div>
          </Paper>
        }

        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <ReactCSSTransitionGroup
            transitionName="FlowTransition"
            transitionEnterTimeout={1000}
            transitionLeaveTimeout={1000}>

            {item.type === "Q" && // If rendering a question

              <RenderedQuestion order={ orderNumber } key={ orderNumber } question={ QuestionStore.questions.get(item.object_id) } onUpdate={(i) => {

                let question = QuestionStore.questions.get(item.object_id);

                if(!UserStore.userData.has("id")) { history.push('/login/' + this.dynamicConfig.getNextConfigWithRedirect(this.props.history.location.pathname)); return } // User must log in

                if(question.subtype === 'likert') {
                  QuestionStore.voteQuestionLikert(item.object_id, i, collectionId, this.state.private);
                }else if(question.subtype === 'mcq') {
                  QuestionStore.voteQuestionMCQ(item.object_id, i, collectionId, this.state.private);
                }

                if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
                  this.navigateToNextItem()
                }else {
                  this.navigateToEnd()
                }
              }} />

            }

            {item.type === "B" && // If rendering a break
              <RenderedBreak break={item.content_object} onContinue={() => {
                if( orderNumber < collectionItems.length - 1 ) { // If there is a next question
                  this.navigateToNextItem()
                }else {
                  this.navigateToEnd()
                }
              }} />
            }

          </ReactCSSTransitionGroup>
        </div>

        <CompleteProfile />

      </div>
    );

  }

  componentDidMount() {
    questionTextFix(this.props.match.params.orderNumber);
  }

  componentDidUpdate() {
    questionTextFix(this.props.match.params.orderNumber);
  }

  navigateToItem(item) {
    this.props.history.push('/survey/' + this.props.match.params.collectionId + '/flow/' + item + "/" + this.dynamicConfig.encodeConfig())
  }

  navigateToNextItem() {
    let currentItem = parseInt(this.props.match.params.orderNumber)
    this.props.history.push('/survey/' + this.props.match.params.collectionId + '/flow/' + (currentItem + 1) + "/" + this.dynamicConfig.encodeConfig())
  }

  navigateToPreviousItem() {
    let currentItem = parseInt(this.props.match.params.orderNumber)
    this.props.history.push('/survey/' + this.props.match.params.collectionId + '/flow/' + (currentItem - 1) + "/" + this.dynamicConfig.encodeConfig())
  }

  navigateToEnd() {
    this.props.history.push('/survey/' + this.props.match.params.collectionId + '/end/' + this.dynamicConfig.encodeConfig())
  }

  togglePrivate() {
    this.setState({private: !this.state.private})
  }

  questionShareLink() {
    let orderNumber = parseInt(this.props.match.params.orderNumber)
    let item = this.state.collectionItems[orderNumber]

    if(item.type === "Q") {
      if(window.self !== window.top) { // In iframe
        return "https://share-test.represent.me/scripts/share.php?question=" + item.object_id + "&redirect=" + encodeURIComponent(document.referrer);
      }else { // Top level
        return "https://share-test.represent.me/scripts/share.php?question=" + item.object_id + "&redirect=" + encodeURIComponent(location.href);
      }
    }else {
      if(window.self !== window.top) { // In iframe
        return encodeURIComponent(document.referrer);
      }else { // Top level
        return encodeURIComponent(location.href);
      }
    }
  }

}

let RenderedBreak = (props) => {
  return(
    <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute' }}>
      <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '0px 20px 40px 20px' }}>
        <h1>{ props.break.title }</h1>
        <ReactMarkdown source={ props.break.text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>
        <RaisedButton label="Continue" onClick={props.onContinue} primary />
      </div>
    </div>  )
}

let RenderedQuestion = (props) => {

  let myVote = null;

  if(props.question.my_vote.length > 0) {
    myVote = props.question.my_vote[0].value;
  }
////
  return (
      <div style={{ display: 'table', width: '100%', height: '100%', position: 'absolute', overflow: 'hidden' }}>
        <div className="FlowTransition" style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 20px 40px 20px' }}>
          <h1 style={{maxWidth: '600px', margin: '60px auto 30px auto'}} className={"questionTextFix" + props.order}>{ props.question.question }</h1>

          {props.question.subtype === "likert" && <LikertButtons onUpdate={(i) => props.onUpdate(i)} value={myVote} />}
          {props.question.subtype === "mcq" && <MCQButtons onUpdate={(i) => props.onUpdate(i)} question={props.question} />}

        </div>
      </div>
  )
}

let ProgressIndicator = (props) => {
  return (
    <div style={props.style}>
      <div style={{color: grey600, pointerEvents: 'all'}}>
        <p style={{width: '40%', display: 'inline-block', textAlign: 'left'}}>

          <FacebookButton appId={window.authSettings.facebookId} element="span" url={props.link}>
            <IconButton style={{padding: 0, margin: "0 10px", width: 'auto', height: 'auto'}}><FacebookBox color={indigo500} /></IconButton>
          </FacebookButton>

          <TwitterButton element="span" url={props.link}>
            <IconButton style={{padding: 0, margin: 0, width: 'auto', height: 'auto'}}><TwitterBox color={blue500} /></IconButton>
          </TwitterButton>

        </p>
        <p style={{textAlign: 'center', width: '20%', display: 'inline-block' }}>{props.order + 1} / {props.max}</p>
        <p style={{width: '40%', display: 'inline-block', textAlign: 'right'}}>Voting {props.private ? "privately" : "publicly"} <span className="FakeLink" onClick={props.togglePrivate}>change</span></p>
      </div>
      <Slider style={{backgroundColor: grey300, width: '100%', pointerEvents: "all"}}
        sliderStyle={{backgroundColor: white, color: cyan600, margin: "0"}}
        max={props.max}
        min={0}
        value={props.order}
        step={1}
        onChange={props.onChange}/>
    </div>
  )
}

let LikertButtons = (props) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div
      className={ "likertButton likertButton" + i + ( props.value && props.value !== i ? " likertButtonDimmed" : " likertButtonSelected")}
      key={i}
      onTouchTap={() => props.onUpdate(i)}></div>); //onClick()
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

//EV: Option #1: Button (bug - doesn't display long text)
// let MCQButtons = (props) => {
//   return (
//     <div>
//       { props.question.choices.map((choice, index) => {
//         return (
//           <RaisedButton
//             primary={!(props.question.my_vote[0] && props.question.my_vote[0].object_id === choice.id)}
//             key={index}
//             label={choice.text}
//             labelStyle={{fontSize: 12}}
//             style={{display:'block', margin: '5px 0px', maxWidth: '600px', minHeight: '25px'}}
//             //overlayStyle={{height: 'auto'}}
//             onTouchTap={() => props.onUpdate(choice.id)}
//         />);
//       })}
//     </div>
//   )
// }

//Option #2: DIV
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
  let target = $('.questionTextFix' + key);
  while(target.height() * 100 / $(document).height() > 20) {
    target.css('font-size', (parseInt(target.css('font-size')) - 1) + 'px')
  }
}

export default QuestionFlow;
