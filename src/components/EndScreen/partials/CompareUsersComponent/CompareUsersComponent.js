import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, autorun, computed } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';

import LoadingIndicator from '../../../LoadingIndicator';

import MessengerPlugin from 'react-messenger-plugin';

import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';

import DynamicConfigService from '../../../../services/DynamicConfigService';

import Results from '../ResultsComponent';
import CompareUsersDetailsComponent from '../CompareUsersDetailsComponent';
import CompareUsersDetails from '../CompareUsersDetails';
import './CompareUsers.css';


import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';
const {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton
} = ShareButtons;
const FacebookIcon = generateShareIcon('facebook')
const TwitterIcon = generateShareIcon('twitter')
const WhatsappIcon = generateShareIcon('whatsapp')
const TelegramShareButton = generateShareIcon('telegram')

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


const labels = {
  "strongly_agree": {label: "Strongly Agree", color: "rgb(74,178,70)"},
  "agree": {label: "Agree", color: "rgb(133,202,102)"},
  "neutral": {label: "Neutral", color: "rgb(128, 128, 128)"},
  "disagree": {label: "Disagree", color: "rgb(249,131,117)"},
  "strongly_disagree": {label: "Strongly disagree", color: "rgb(244,56,41)"}
}

@inject("CollectionStore", "UserStore")
@observer
class CompareCollectionUsers extends Component {
  constructor(props) {
    super(props);

    this.dynamicConfig = DynamicConfigService;
    this.viewData = observable.shallowObject({
      isLoggedIn: observable(null),
      pageReadiness: {
        isCompareUsersReady: observable(false),
        isQuestionResultsReady: observable(false),
        isCompareCandidatesReady: observable(false)
      },
      isComparingUsersShowing: observable(false),
      isComparingCandidatesShowing: observable(false),
      users: observable.shallowArray([]),
      candidates: observable.shallowArray([]),
      compareData: observable.shallowMap(),
      compareCandidatesData: observable.shallowMap(),
      following: observable.shallowMap(),
      followingCandidates: observable.shallowMap(),
      questions: observable.shallowArray(),
      collection_tags: observable.shallowArray([])
    });
  }

  componentDidMount = () => {
    let { CollectionStore, UserStore, collectionId = 1, userIds} = this.props;
    let shouldAutorunDispose = false;
    let autorunDispose = autorun(() => { // aurotun called multiple times, shouldAutorunDispose needed
      if(UserStore.isLoggedIn() && !shouldAutorunDispose) {
        shouldAutorunDispose = true;
        this.viewData.isLoggedIn.set(true);
        this.loadData();
      }
      if(shouldAutorunDispose && autorunDispose) {
        autorunDispose();
      }
    });
    this.isPageReady.get();
  }

  isPageReady = computed(() => {
    // return computed(() => {
      // console.log('computed', this.viewData.pageReadiness.isQuestionResultsReady.get());
      return
        this.viewData.pageReadiness.isCompareUsersReady.get()
        && this.viewData.pageReadiness.isQuestionResultsReady.get()
    // }).get();
  })

  copyToClipboard = (id) => {
    let textField = document.getElementById(id)
    textField.select()
    document.execCommand('copy')
  }


  loadData = () => {
    let { CollectionStore, UserStore, collectionId = 1, userIds} = this.props;
    let currentUserId = this.viewData.isLoggedIn.get() && UserStore.userData.get("id");
    const propUserIds = userIds.peek();
    //const propUserIds = [6,100,1000]
    CollectionStore.getCollectionItemsById(collectionId)
        .then((res) => {
          this.viewData.questions.replace(res);
          this.viewData.pageReadiness.isQuestionResultsReady.set(true);
          return res;
        })

        // const getCollectionTags = (collectionId) => {
        //     window.API.get('/api/tags/?ordering=-followers_count')
        //       .then((response) => {
        //         if(response.data.results) {
        //           return viewData.collection_tags.push(response.data.results);
        //         }
        //       })
        //       .catch((error) => {
        //         console.log(error, error.response.data);
        //       })
        //   }
        //   getCollectionTags();
        if(propUserIds.length) {
          this.viewData.isComparingUsersShowing.set(true);
          UserStore.amFollowingUsers(currentUserId, propUserIds).then(res => {
            const results = res.results;
            results.forEach(({ following, id }) => this.viewData.following.set(following, id))
          })

          UserStore.compareMultipleUsers(currentUserId, propUserIds).then((compareData) => {
            propUserIds.forEach((id) => {
              this.viewData.compareData.set(id, compareData.results[id])
            })
          })

          UserStore.getUsersById(propUserIds).then((usersData) => {
            usersData.results.ids.forEach((id) => {
              this.viewData.users.push(usersData.results[id])
            })
            this.viewData.pageReadiness.isCompareUsersReady.set(true);
          })
        } else {
          this.viewData.pageReadiness.isCompareUsersReady.set(true);
        }

        if(UserStore.isLoggedIn()) {
          UserStore.getCachedMe().then(user => {
            if(this.dynamicConfig.config.survey_end.should_show_compare_candidates) {
              this.viewData.isComparingCandidatesShowing.set(true);

              UserStore.getCandidatesByLocation(user.region).then(candidates => {
                if(!candidates.length) {
                  this.viewData.isComparingCandidatesShowing.set(false);
                  this.viewData.pageReadiness.isCompareCandidatesReady.set(true);
                  return;
                }
                this.viewData.candidates.replace(candidates);
                let candidatesIds = candidates.map(user => { return user.id });
                UserStore.amFollowingUsers(currentUserId, candidatesIds).then(res => {
                  const results = res.results;
                  results.forEach(({ following, id }) => this.viewData.followingCandidates.set(following, id))
                })
                UserStore.compareMultipleUsers(currentUserId, candidatesIds).then((compareData) => {
                  candidatesIds.forEach((id) => {
                    this.viewData.compareCandidatesData.set(id, compareData.results[id])
                  })
                  this.viewData.pageReadiness.isCompareCandidatesReady.set(true);
                })
              })
            } else {
              this.viewData.pageReadiness.isCompareCandidatesReady.set(true);
            }
          })
        }
  }

  render() {
    // if (!userIds.length) console.log('No users specified to compare');
    // return <CompareCollectionUsersView data={this.viewData} />
    if (!this.viewData.isLoggedIn.get()) return <SignInToSeeView />;


    // TODO make it computed
    if (!(this.viewData.pageReadiness.isCompareUsersReady.get()
      && this.viewData.pageReadiness.isQuestionResultsReady.get() && this.viewData.pageReadiness.isCompareCandidatesReady.get())) return <LoadingIndicator />;
    return (<div className='endPage'>
      {this.viewData.isComparingUsersShowing.get() && <UserCompareCarousel
        compareData={this.viewData.compareData}
        users={this.viewData.users}
        following={this.viewData.following}
        collectionId={this.props.collectionId}
      />}


      {this.viewData.isComparingCandidatesShowing.get() && <UserCompareCarousel
        compareData={this.viewData.compareCandidatesData}
        users={this.viewData.candidates}
        following={this.viewData.followingCandidates}
        collectionId={this.props.collectionId}
      />}
      <QuestionResultsCarousel questions={this.viewData.questions} collectionId={this.props.collectionId}/>

      <MessengerPluginBlock authToken={this.props.UserStore.getAuthToken()} loggedFB={this.props.UserStore.loggedFB}/>

      <div>
       <div id="shareMe">
       Want to share? Click to copy:
        <TextField
          id="copyToClipboardEnd"
          value={`${window.location.origin}/survey/${this.props.collectionId}`}
          multiLine={false}
          style={{height: 14, fontSize: 12, width: 1}}
          inputStyle={{textAlign: 'center'}}
        />
        <span onClick={e => this.copyToClipboard('copyToClipboardEnd')}> URL</span>

        &nbsp; &middot; &nbsp;
        <TextField
          id="copyToClipboardEmbed"
          value={`<iframe src="${window.location.origin}/survey/${this.props.collectionId}" height="600" width="100%" frameborder="0"></iframe>`}
          multiLine={false}
          style={{height: 14, fontSize: 12,  width: 1}}
          inputStyle={{textAlign: 'center'}}
        />
        <span onClick={e => this.copyToClipboard('copyToClipboardEmbed')}>Embed code </span>

        </div>
      </div>


    </div>)
  }
}

const heading = {
  textAlign: 'left !important',
  cssFloat: 'left',
  fontSize: 16,
  color: '#999',
  textTransform: 'uppercase',
  marginBottom: '0.5em',
  marginTop: '2em',
};

const UserCompareCarousel = observer(({compareData, users, following, collectionId}) => {
  return (<div  style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start'}}>

    {compareData && users.map((user) => {

      return (
        <div key={user.id} >
          <UserCardSmall user={user}
            compareData={compareData.get(user.id)}
            following={observable(following.get(user.id))}
            collectionId={collectionId}
          />
        </div>
      )
    })}
  </div>)
})

@inject("authToken", "loggedFB")
@observer
class MessengerPluginBlock extends Component {
//const MessengerPluginBlock = observer(({authToken, loggedFB}) => {

render(){
  let messengerRefData = "get_started_with_token";
  if(this.props.authToken) {
    messengerRefData += "+auth_token=" + this.props.authToken;
    }
  const loggedFB = this.props.loggedFB;

  return (
    <div style={{ borderTop: '2px solid #1B8AAE', borderBottom: '2px solid #1B8AAE', width: '100vw', background: 'rgba(27,138,174,0.11)', padding: 10, margin: '10px auto',  textAlign: 'center', maxHeight: loggedFB.get() ? 400 : 0, display: loggedFB.get() ? 'block':'none'}}>
    <p style={{ color: '#1B8AAE', maxWidth: 400, margin: '5px auto 0 auto', fontSize: 18}}>
    <strong>Vote on important issues, tell your MP, and track how well they represent you -- all directly from Facebook Messenger!</strong>
    <br />
    <span style={{ color: '#1B8AAE', maxWidth: 600, margin: '0 auto 5px auto', fontSize: 14, lineHeight: 1}}>
    Click the button below to get started.
    </span>
    </p>
      <MessengerPlugin
        appId={String(window.authSettings.facebookId)}
        pageId={String(window.authSettings.facebookPageId)}
        size="xlarge"
        passthroughParams={messengerRefData}
      />
    </div>
  )


}}




const QuestionResultsCarousel = observer(({questions, collectionId}) => {
  return (<div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start'}}>
  <Subheader style={{fontWeight: 600, textTransform: 'upperCase'}} >All Results</Subheader>


<div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start'}}>
  <FacebookShareButton 
    url={window.location.origin}
    title={`Represent: Democracy as it should be. Survey`}
    picture={`https://represent.me/assets/img/ogimage.jpg`}
    className='fb-network__share-button'>
    <FacebookIcon
      size={48}
      round />
  </FacebookShareButton>
  <TwitterShareButton 
    url={window.location.origin}
    title={`Represent: Democracy as it should be. Survey`}
    picture={`https://represent.me/assets/img/ogimage.jpg`}
    className='fb-network__share-button'>
    <TwitterIcon
      size={48}
      round /> 
  </TwitterShareButton>

  <WhatsappShareButton 
    url={window.location.origin}
    title={`Represent: Democracy as it should be. Survey`}
    picture={`https://represent.me/assets/img/ogimage.jpg`}
    className='fb-network__share-button'>
    <WhatsappIcon
      size={48}
      round />
  </WhatsappShareButton>
  </div>



      {questions.length > 0 &&
        questions.peek().map((question, i) => {
          return (
          <div key={`ques-${i}`} style={{}}>
            <Results questionId={question.object_id} id={i} collectionId={collectionId}/>

          </div>
        )
      })
        }
  </div>)
})


@inject("user", "compareData", 'following', 'UserStore')
@observer
class UserCardSmall extends Component {
  constructor(props) {
    super(props);

    this.areCompareDetailsShowing = observable(false)
    this.state = {
      //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
      checked: [true,true,false,false,false]
    }
  }


  setFollowing = () => {
    this.props.UserStore.setFollowing(this.props.user.id).then((res) => {
      this.props.following.set(res.id);
    })
  }
  removeFollowing = () => {
    this.props.UserStore.removeFollowing(this.props.following.value);
    this.props.following.set(0);
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button`)[0].click()
  }

  render(){
    // if (!this.props.user) return null;
    if (!this.props.user) return <LoadingIndicator />;

    const { user, UserStore, collectionId } = this.props

    const name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
    const age = user.age ? user.age  : '';
    const bio = user.bio ? user.bio  : '';
    const photo = user.photo ? user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random()*7)}.png`;;
    const location = (user.country_info ? user.country_info.name + (user.region_info ? ', ' : '') : '') + (user.region_info ? user.region_info.name : '');
    const { count_comments, count_followers, count_following_users, count_group_memberships, count_question_votes, count_votes } = user

    let match = '';
    let questions_counted = null;
    if(this.props.compareData) {
     match = Math.floor(100-this.props.compareData.difference_percent);
     questions_counted = this.props.compareData.questions_counted;
    }
    //${window.location.origin}
    const fb = (
      <FacebookShareButton
        url={`${window.location.origin}/survey/${collectionId}`}
        title={`I'm ${match}% match with ${name}. How do you compare?`}
        picture={`https://share.represent.me/compare_users/compare_users_${UserStore.userData.get('id')}_${user.id}.png`}
        className='fb-network__share-button'
        description="This isn't just another party comparison tool. Yes, you'll find your best match, but you'll also be able to tell whoever gets elected what you want and hold them to account."
        >

        <FacebookIcon
          size={32}
          round />
      </FacebookShareButton>
    )

    const barStyle = this.areCompareDetailsShowing.get() ? {display: 'block'} : {display: 'none'}

    return (
      this.props &&
      <Card
        style={{margin: '0 5px 10px 5px', padding: '10px 0 0 0', width: 260,  overflowX: 'hidden'}}
        className='scrollbar'
        >

        <Avatar src={photo} size={50} style={{alignSelf: 'center', display: 'block', margin: '0 auto', marginTop: '10px'}}/>

        <CardTitle title={name} subtitle={location} style={{textAlign: 'center', padding: '4px 16px', }} titleStyle={{lineHeight: 1, fontSize: 18, fontWeight: 600 }} />


        <CardText style={{backgroundColor: '#e6f7ff', padding: '10px 4px', marginTop: 10}}>
          <h2 style={{ fontSize: '45px', margin: '1px 0', lineHeight: 0.8, textAlign: 'center'}}>{`${match}%`}</h2>

          {this.props.compareData ? (
            <div>

              <p style={{ color: '#999', margin:0,   }}>{`match on ${questions_counted} questions`}</p>
              <MatchBarchart compareData={this.props.compareData} />
              </div>
            ) : <p></p>}

              <FlatButton
                label={this.areCompareDetailsShowing.get() ? "Hide detail" : 'Show Detail'}
                primary={true}
                style={{color: '#999', fontSize: 12, lineHeight: 1, textTransform: 'none'}}
                onTouchTap={() => this.areCompareDetailsShowing.set(!this.areCompareDetailsShowing.get())}
                />
        </CardText>


        <CardText style={{textAlign: 'center', padding: '8px 16px 0 16px', color: '#444'}} className='cardText'>
          <div style={{ margin: '5px'}}>
            { this.props.following.get() > 0 ?
              <RaisedButton
                label="following"
                primary={true}
                onTouchTap={this.removeFollowing}
              /> :
              <RaisedButton
                label="follow"
                onTouchTap={this.setFollowing}
                /> }
              <RaisedButton
                onClick={this.clickFB}
                label=""
                style={{marginLeft: 12}}
                backgroundColor="#3b5998"
                icon={fb}
              />
            </div>
        </CardText>

        <CardText style={{backgroundColor: '#e6f7ff', padding: '4px 4px'}}>

            {this.areCompareDetailsShowing.get() ? <div style={barStyle}>
              {/*<CompareUsersDetailsComponent userIds={[this.props.user.id]} />*/}
              <CompareUsersDetails userId={this.props.user.id} userData={this.props.user} />
            </div> : null}
        </CardText>
    </Card>
  )
}}


const MatchBarchart = observer(({ compareData }) => {
  let totalCount = 0;
  compareData.difference_distances.map((diff) => totalCount += diff);
  let diffs = compareData.difference_distances;
  let values = {
    strongly_agree: Math.round(1000*(diffs[0])/ totalCount)/10,
    agree: Math.round(1000*(diffs[1])/ totalCount)/10,
    neutral: Math.round(1000 *(diffs[2]) / totalCount)/10,
    disagree: Math.round(1000 *(diffs[3]) / totalCount)/10,
    strongly_disagree: Math.round(1000*(diffs[4])/ totalCount)/10
  };

  return (
    <ResponsiveContainer minHeight={20} maxWidth={150} style={{border: '1px solid red'}}>
    <BarChart
      layout="vertical"
      height={10}
      data={[values]}
      barGap={1}
    >
      <XAxis domain={[0, 100]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_agree" stackId="1" fill={labels[Object.keys(values)[0]]['color']} />
      <Bar dataKey="agree" stackId="1" fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="neutral" stackId="1" fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="disagree" stackId="1" fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="strongly_disagree" stackId="1" fill={labels[Object.keys(values)[4]]['color']} />
      {/* <Tooltip content={<CustomTooltip/>}/> */}
    </BarChart>
  </ResponsiveContainer>
)
})

const SignInToSeeView = () => {
  return (<div className="sign-in-to-see">
    ..
  </div>)
}

export default CompareCollectionUsers;
