import React, {Component} from 'react'
import moment from 'moment'
import { observer, inject } from "mobx-react"
import ReactMarkdown from 'react-markdown';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';


import Left from 'material-ui/svg-icons/navigation/arrow-back';
import Right from 'material-ui/svg-icons/navigation/arrow-forward';


const styles = {
  hiddenIcon: {
    display: 'none'
  },
  icon: {
    width:'20px',
    height: '20px',
    fill: '#999',
    position: 'absolute',
    top: '50%'
  }, 
  
}

@inject("UserStore")
class QuestionFlowVote extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      votingModePrivate: this.getDefHideAnswers(),
      text: this.getDefHideAnswers() ? 'privately' : 'publicly'
    }
    this.changeVoteMode = this.changeVoteMode.bind(this)
    this.getDefHideAnswers = this.getDefHideAnswers.bind(this)
  }

  changeVoteMode() {
    const newValue = !this.state.votingModePrivate
    const text = this.state.votingModePrivate ? 'publicly' : 'privately'
    this.setVotingModeState(newValue, text)
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.index !== nextProps.index) {
      const defHideAnswers = this.getDefHideAnswers()
      const text = defHideAnswers ? 'privately' : 'publicly'
      this.setVotingModeState(defHideAnswers, text)
    }
  }

  setVotingModeState(votingModePrivate, text) {
    this.setState({
      votingModePrivate: votingModePrivate,
      text: text
    })
  }

  getDefHideAnswers() {
    return this.props.UserStore.userData.get("defHideAnswers")
  }

  render() {
    const { items, index, onVote, navigateNext, getNextQuestion, getPrevQuestion, currentQuestion } = this.props
    const item = items[index];
    const { hiddenIcon, icon } = styles
    const showAnswered = !!currentQuestion.my_vote.length

    return (
       <div style={{height: '100%'}}>
          <div className="answering-mode-wrapper small">Answering <a onClick={this.changeVoteMode}>{ this.state.text }</a></div>
          {
            showAnswered && 
              <div className="answered small">
                Last answered on {moment(currentQuestion.my_vote[0].modified_at).format('DD MMMM YYYY')}
              </div>
          }

          {/*<div className="nav-buttons">*/}
            <div>
              <Left style={ Object.assign({ left:'15px', float:'left'}, (index < 1) ? hiddenIcon : icon, ) } onClick={getPrevQuestion}/>
            </div>
            <div>
              <Right style={Object.assign({ right:'15px', float: 'right' }, icon)} onClick={getNextQuestion}/>
            </div>
          {/*</div>*/}

            {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={onVote} key={"FlowTransition" + index} defHideAnswer={this.state.votingModePrivate}/>}
            {item.type === "B" && <RenderedBreak title={item.content_object.title} text={item.content_object.text} onContinue={navigateNext}/>}

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

const RenderedQuestion = inject("QuestionStore")(observer(({QuestionStore, id, index, onVote, defHideAnswer}) => {

  let {question, my_vote, subtype, choices} = QuestionStore.questions.get(id)

  let myVote = null;
  if(my_vote.length > 0 && subtype === 'likert') {myVote = my_vote[0].value}
  if(my_vote.length > 0 && subtype === 'mcq') {myVote = my_vote[0].object_id}

  return (
    <MiddleDiv>
      <h1 className={"questionText questionTextFix-" + index} style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>{question}</h1>
      {subtype === "likert" && <LikertButtons value={myVote} onVote={onVote} defHideAnswer={defHideAnswer}/>}
      {subtype === "mcq" && <MCQButtons value={myVote} onVote={onVote} defHideAnswer={defHideAnswer} choices={choices}/>}
    </MiddleDiv>
  )

}))

const RenderedBreak = ({title, text, onContinue}) => (
  <MiddleDiv style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>
    <h1 className="questionBreak">{ title }</h1>
    <ReactMarkdown source={ text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>
    <RaisedButton label="Continue" onClick={onContinue} primary />
  </MiddleDiv>
)


const LikertButtons = ({value, onVote, defHideAnswer}) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div
      className={ "likertButton likertButton" + i + ( value && value !== i ? " likertButtonDimmed" : "")}
      key={i}
      onTouchTap={() => onVote(i, defHideAnswer)}></div>);
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto', marginBottom: '60px'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

const MCQButtons = ({choices, value, onVote, defHideAnswer}) => (
  <div style={{paddingBottom: '50px'}}>
    {choices.map((choice, index) => {
      let activeMCQ = value === choice.id ? 'activeMCQ' : '';
      return (
        <div key={`p-${index}`} className={`mcqButton ${activeMCQ}`} onTouchTap={() => onVote(choice.id)}>
          <Checkbox style={styles.checkbox} selected={activeMCQ} />
          <span style={{ display:'inline-block', margin: '4px'}}>{choice.text}</span>
        </div>
      );
    })}
  </div>
)

const Checkbox = ({selected}) => {
  return (<div style={{float: 'left'}}>
    {selected ? (<svg xmlns="http://www.w3.org/2000/svg" fill="#fff" height="25" viewBox="0 0 25 25" width="25">
        <path d="M0 0h24v24H0z" fill="none"/>
        <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>) :
    (<svg xmlns="http://www.w3.org/2000/svg" fill="#1B8AAE" height="25" viewBox="0 0 25 25" width="25">
        <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
    </svg>)}
  </div>);
} 


export default QuestionFlowVote;