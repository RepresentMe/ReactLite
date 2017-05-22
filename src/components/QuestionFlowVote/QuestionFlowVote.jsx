import React, {Component} from 'react'
import moment from 'moment'
import { observer, inject } from "mobx-react"
import { observable } from "mobx"
import ReactMarkdown from 'react-markdown';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Checkbox from './partials/Checkbox'

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
    top: '-15px'
  },

}

@inject("UserStore")
@observer
class QuestionFlowVote extends Component {

  isPrivacyInfoModalOpen = observable(false)
  questionVisible = observable(false)
  constructor(props) {
    super(props)
    this.state = {
      votingModePrivate: this.getDefHideAnswers(),
      text: this.getDefHideAnswers() ? 'private' : 'public'
    }
    this.changeVoteMode = this.changeVoteMode.bind(this)
    this.getDefHideAnswers = this.getDefHideAnswers.bind(this)
  }

  changeVoteMode() {
    const newValue = !this.state.votingModePrivate
    const text = this.state.votingModePrivate ? 'public' : 'private'
    this.setVotingModeState(newValue, text)
  }

  componentDidMount() {
    this.questionVisible.set(true);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.index !== nextProps.index) {
      const defHideAnswers = this.getDefHideAnswers()
      const text = defHideAnswers ? 'private' : 'public'
      this.setVotingModeState(defHideAnswers, text);
      setTimeout(() => this.questionVisible.set(true), 10);
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

  toggleModal() {
    this.isPrivacyInfoModalOpen.set(!this.isPrivacyInfoModalOpen.get())
  }

  handleUserVote = (i, votingMode) => {
    this.questionVisible.set(false);
    setTimeout(() => this.props.onVote(i, votingMode), 40);
  }
  handleGetPrevQuestion = (i, votingMode) => {
    this.questionVisible.set(false);
    setTimeout(() => this.props.getPrevQuestion(), 40);
  }
  handleGetNextQuestion = (i, votingMode) => {
    this.questionVisible.set(false);
    setTimeout(() => this.props.getNextQuestion(), 40);
  }

  render() {
    const { items, index, onVote, navigateNext, getNextQuestion, getPrevQuestion, currentQuestion } = this.props
    const item = items[index];
    const { hiddenIcon, icon } = styles
    const showAnswered = !!currentQuestion.my_vote.length





    return (
       <div style={{height: '100%'}}>
          <div className="answering-mode-wrapper small">
          <a onClick={this.changeVoteMode}>{ this.state.text }</a>
          <IndoIcon onClick={() => this.toggleModal()} style={{width:15, height:15,verticalAlign: 'middle',margin: '-3px 0 0 4px', cursor: 'pointer'}} />
          </div>
          {
            showAnswered &&
              <div className="answered small">
                Last answered on {moment(currentQuestion.my_vote[0].modified_at).format('DD MMMM YYYY')}
              </div>
          }

          {/*<div className="nav-buttons">*/}
            <div className="nav-arrows">
              <Left style={ Object.assign({ left:'0px', float:'left'}, (index < 1) ? hiddenIcon : icon, ) } onClick={this.handleGetPrevQuestion}/>
            </div>
            <div className="nav-arrows">
              <Right style={Object.assign({ right:'5px', float: 'right' }, icon)} onClick={this.handleGetNextQuestion}/>
            </div>
          {/*</div>*/}

            {item.type === "Q" && <RenderedQuestion id={item.object_id} index={index} onVote={this.handleUserVote} key={"FlowTransition" + index} defHideAnswer={this.state.votingModePrivate} classNames={`question-block ${this.questionVisible.get() ? 'question-block-visible':null}`} />}

            {item.type === "B" && <RenderedBreak title={item.content_object.title} text={item.content_object.text} onContinue={navigateNext}/>}


            <Dialog
              title="Your privacy"
              actions={[
              <FlatButton
                label="Learn more about privacy"
                primary={true}
                href="https://represent.me/legal/"
              />,<FlatButton
                label="Continue"
                onTouchTap={() => this.isPrivacyInfoModalOpen.set(false)}
              />]}
              modal={false}
              open={this.isPrivacyInfoModalOpen.get()}
              onRequestClose={() => this.isPrivacyInfoModalOpen.set(false)}
            >
              Your answers are set to 'private' by default. This means no one else can see how you have answered a specific question. If you'd like to go 'on the record', as an elected representative, or would like to represent others, you should set your answers to 'public'.
            </Dialog>
        </div>
    )
  }
}

const MiddleDiv = ({children, classNames}) => (
  <div style={{ display: 'table', width: '100%', height: '70vh', overflow: 'scroll' }} className={classNames}>
    <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', maxWidth: '400px', padding: '0 10px' }}>
      {children}
    </div>
  </div>
)

const RenderedQuestion = inject("QuestionStore")(observer(({QuestionStore, id, index, onVote, defHideAnswer, classNames}) => {

  let {question, my_vote, subtype, choices} = QuestionStore.questions.get(id)

  let myVote = null;
  if(my_vote.length > 0 && subtype === 'likert') {myVote = my_vote[0].value}
  if(my_vote.length > 0 && subtype === 'mcq') {myVote = my_vote[0].object_id}

  return (
    <MiddleDiv classNames={classNames}>
      <p className={"questionText questionTextFix-" + index} style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>{question}</p>
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
      className={ `likertButton likertButton${i} ${(value && value == i) ? 'likertButtonSelected' : 'likertButtonDimmed'}`}
      key={i}
      onTouchTap={() => onVote(i, defHideAnswer)}></div>);
  }
  return (<div style={{overflow: 'hidden', textAlign: 'center', margin: '0 auto', marginBottom: '60px'}}>{likertJSX.map((item, index) => {return item})}</div>);
}

@observer
class MCQButtons extends Component {
  constructor(props) {
    super(props);

    this.choiceHovers = observable([]);
    this.props.choices.map((choice, i) => {
      this.choiceHovers[i] = false;
    })
  }

  render() {
    const {choices, value, onVote, defHideAnswer} = this.props;
    return (
      <div style={{paddingBottom: '50px'}}>
        {choices.map((choice, index) => {
          let activeMCQ = value === choice.id ? 'activeMCQ' : '';
          let isHovered = observable(false);
          return (
            <div key={`p-${index}`} className={`mcqButton ${activeMCQ}`} onTouchTap={() => onVote(choice.id)}
                onMouseEnter={() => this.choiceHovers[index] = true} onMouseLeave={() => this.choiceHovers[index] = false}>
              <Checkbox style={styles.checkbox} selected={activeMCQ} isHovered={this.choiceHovers[index]} />
              <span style={{ display:'inline-block', margin: '4px'}}>{choice.text}</span>
            </div>
          );
        })}
      </div>
    )
  }
}



const IndoIcon = (props) => {
  return <svg xmlns="http://www.w3.org/2000/svg" fill="#999" height="24" viewBox="0 0 24 24" width="24" {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
  </svg>
}

export default QuestionFlowVote;
