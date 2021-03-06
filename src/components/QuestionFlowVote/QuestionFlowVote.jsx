import React, {Component} from 'react'

import { observer, inject } from "mobx-react"
import { observable } from "mobx"
import ReactMarkdown from 'react-markdown';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import Checkbox from './partials/Checkbox'
import IconButton from 'material-ui/IconButton';
import {grey400} from 'material-ui/styles/colors';
import MoreText from '../Components/MoreText';

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

    //patch user object with his choice to vote public or privately
    // window.API.patch("/auth/me/", {
    //   defHideAnswers: newValue
    // }).then((response) => {
    //   //refresh user object in UserStore
    //   this.props.UserStore.getMe();
    // }).catch((error) => {
    //   console.log(JSON.stringify(error.response.data))
    // });

    //set component state
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
    const { items, index, navigateNext, currentQuestion } = this.props
    const item = items[index];
    const { hiddenIcon, icon } = styles
    const showAnswered = item.type === "Q" && !!currentQuestion.my_vote.length

    const m_names = new Array("Jan", "Feb", "Mar",
      "Apr", "May", "Jun", "Jul", "Aug", "Sep",
      "Oct", "Nov", "Dec");

    return (
       <div style={{height: '100%'}}>
          <div className="answering-mode-wrapper small">
          <a onClick={this.changeVoteMode}>{ this.state.text }</a>
          <IndoIcon onClick={() => this.toggleModal()} style={{width:15, height:15,verticalAlign: 'middle',margin: '-3px 0 0 4px', cursor: 'pointer'}} />
          </div>
          {
            showAnswered &&
              <div className="answered small">
            You voted on {new Date(currentQuestion.my_vote[0].modified_at).getDate()} {m_names[new Date(currentQuestion.my_vote[0].modified_at).getMonth()]}. Confirm or change.
              </div>
          }

          {/*<div className="nav-buttons">*/}
            <div className="nav-arrows">
              <IconButton
                tooltip="Prev"
                tooltipPosition="top-right"
                onTouchTap={this.handleGetPrevQuestion}
                style={{position: 'absolute', top: '50%', left: 0, display: (index < 1) ? 'none' : 'block'}}
                iconStyle={{fill: grey400}}
                >
                <Left style={ Object.assign({ left:'0px', float:'left'}, (index < 1) ? hiddenIcon : icon ) } />
              </IconButton>
            </div>

            <div className="nav-arrows">
              <IconButton
                tooltip="Next"
                tooltipPosition="top-left"
                onTouchTap={this.handleGetNextQuestion}
                style={{position: 'absolute', top: '50%', right: 0}}
                iconStyle={{fill: grey400}}
                >
                <Right style={Object.assign({ right:'5px', float: 'right' }, icon)} />
              </IconButton>
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

  let {question, description, my_vote, subtype, choices} = QuestionStore.questions.get(id)

  let myVote = null;
  if(my_vote.length > 0 && subtype === 'likert') {myVote = my_vote[0].value}
  if(my_vote.length > 0 && subtype === 'mcq') {myVote = my_vote[0].object_id}

  return (
    <MiddleDiv classNames={classNames}>
      <p className={"questionText questionTextFix-" + index} style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>{question}</p>
      <p className="questionDescription">
        {description && <MoreText className="moreText"
          text={description || ""}
          />}
      </p>
      <div className="voteChoices">
      {subtype === "likert" && <LikertButtons value={myVote} onVote={onVote} defHideAnswer={defHideAnswer}/>}
      {subtype === "mcq" && <MCQButtons value={myVote} onVote={onVote} defHideAnswer={defHideAnswer} choices={choices}/>}
      </div>
    </MiddleDiv>
  )

}))

const RenderedBreak = ({title, text, onContinue}) => (
  <MiddleDiv>
    <h1 className="questionBreak">{ title }</h1>
    {text && <ReactMarkdown className="questionBreakp"  source={ text } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}}/>}
    <RaisedButton label="Okay!" onClick={onContinue} primary />
  </MiddleDiv>
)


const LikertButtons = ({value, onVote, defHideAnswer}) => {
  let likertJSX = [];
  for (let i = 1; i <= 5; i++) {
    likertJSX.push(<div
      className={ `likertButton likertButton${i} ${(value && value === i) ? 'likertButtonSelected' : 'likertButtonDimmed'}`}
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
          //let isHovered = observable(false);
          return (
            <div key={`p-${index}`} className={`mcqButton ${activeMCQ}`} onTouchTap={() => onVote(choice.id, defHideAnswer)}
                onMouseEnter={() => this.choiceHovers[index] = true} onMouseLeave={() => this.choiceHovers[index] = false}>
              <Checkbox style={styles.checkbox} selected={activeMCQ} isHovered={this.choiceHovers[index]} />
              <span style={{ display:'block', margin: '4px 25px'}}>{choice.text}</span>
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
