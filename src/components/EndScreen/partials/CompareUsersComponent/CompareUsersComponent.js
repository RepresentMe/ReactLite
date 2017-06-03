import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, autorun, computed } from 'mobx';
import { Link } from 'react-router-dom';
import { Card, CardText, CardActions, CardTitle } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';

import IconButton from 'material-ui/IconButton';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import SocialShare from 'material-ui/svg-icons/social/share';
import Follow from 'material-ui/svg-icons/social/person-add';
import LoadingIndicator from '../../../LoadingIndicator';

import MessengerPlugin from 'react-messenger-plugin';

import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';

// import IconButton from 'material-ui/IconButton';
// import {grey400} from 'material-ui/styles/colors';
// import Left from 'material-ui/svg-icons/navigation/arrow-back';

import DynamicConfigService from '../../../../services/DynamicConfigService';

import Results from '../ResultsComponent';
//import CompareUsersDetailsComponent from '../CompareUsersDetailsComponent';
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
  "strongly_agree": { label: "Strongly Agree", color: "rgb(74,178,70)" },
  "agree": { label: "Agree", color: "rgb(133,202,102)" },
  "neutral": { label: "Neutral", color: "rgb(128, 128, 128)" },
  "disagree": { label: "Disagree", color: "rgb(249,131,117)" },
  "strongly_disagree": { label: "Strongly disagree", color: "rgb(244,56,41)" }
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
      areLocalCandidatesShowing: observable(false),
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

  componentWillMount(){
    //if generalAnalyticsData is not loaded, load it into UserStore
    if (!this.props.UserStore.generalAnalyticsData.analytics_os){
      this.props.UserStore.getGeneralAnalyticsData();
    }
  }

  componentDidMount = () => {
    let { CollectionStore, UserStore, collectionId = 1, userIds } = this.props;
    let shouldAutorunDispose = false;
    let autorunDispose = autorun(() => { // aurotun called multiple times, shouldAutorunDispose needed
      if (UserStore.isLoggedIn() && !shouldAutorunDispose) {
        shouldAutorunDispose = true;
        this.viewData.isLoggedIn.set(true);
        this.loadData();
      }
      if (shouldAutorunDispose && autorunDispose) {
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

  countShare = () => {
    this.props.UserStore.countShareClicks({
      analytics_interface: 'collection',
      url: `${window.location.origin}/survey/${this.props.collectionId}`
    })
  }

  loadData = () => {
    let { CollectionStore, UserStore, collectionId = 1, userIds } = this.props;
    let currentUserId = this.viewData.isLoggedIn.get() && UserStore.userData.get("id");
    const propUserIds = userIds.peek();
    if (!this.props.UserStore.userInstance.get('id')){
      this.props.UserStore.getCurrUserInstance(currentUserId)
    }


      //.then(res => console.log('userInstance', res));

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


    if (propUserIds.length) {
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


    UserStore.getCachedMe().then(user => {
      if (this.dynamicConfig.config.survey_end.should_show_compare_candidates) {
        UserStore.getCandidatesByLocation(user.region).then(candidates => {
          this.viewData.candidates.replace(candidates); //this.viewData.candidates.peek()
          setCandidatesStat()
        })
      } else {
        setCandidatesStat()
      }
    })
    const setCandidatesStat = () => {
      //candidates shown by default
      this.viewData.areLocalCandidatesShowing.set(true);
      //let candidatesIds = [17351, 17663, 17667, 17687, 17689, 17710, 17711, 17692];
      let candidatesIds = this.dynamicConfig.config.survey_end.candidatesIds;
      UserStore.getUsersById(candidatesIds).then((usersData) => {
        usersData.results.ids.forEach((id) => {
          this.viewData.candidates.push(usersData.results[id])
        })
        this.viewData.pageReadiness.isCompareCandidatesReady.set(true);
      })

      candidatesIds = candidatesIds.concat(this.viewData.candidates.map(user => { return user.id }));

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
    }
  }

  render() {
    // if (!userIds.length) console.log('No users specified to compare');
    // return <CompareCollectionUsersView data={this.viewData} />
    if (!this.viewData.isLoggedIn.get()) return <SignInToSeeView />;


    // TODO make it computed
    if (!(this.viewData.pageReadiness.isCompareUsersReady.get()
      && this.viewData.pageReadiness.isQuestionResultsReady.get()
      && this.viewData.pageReadiness.isCompareCandidatesReady.get()
    ))
      return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadingIndicator />
        </div>
      );

    return (
      <div className='endPage'>

      <MessengerPluginBlock authToken={this.props.UserStore.getAuthToken()} loggedFB={this.props.UserStore.loggedFB} />


        {/* <IconButton
          style={{position: 'fixed', top: 30, left: 10}}
          tooltip="Back to questions"
          tooltipPosition="bottom-right"
          //onTouchTap={this.handleGetPrevQuestion}
          iconStyle={{fill: grey400}}
          ><Left/>
        </IconButton> */}

        {this.viewData.isComparingUsersShowing.get() && <UserCompareCarousel
          compareData={this.viewData.compareData}
          users={this.viewData.users}
          following={this.viewData.following}
          collectionId={this.props.collectionId}
        />}


        {this.viewData.areLocalCandidatesShowing.get() && <UserCompareCarousel
          compareData={this.viewData.compareCandidatesData}
          users={this.viewData.candidates}
          following={this.viewData.followingCandidates}
          collectionId={this.props.collectionId}
        />}
        <QuestionResultsCarousel
          questions={this.viewData.questions}
          collectionId={this.props.collectionId}
          countShare={this.countShare}
          />


        <div>
          <div id="shareMe">
            Want to share? Click to copy:
        <TextField
              id="copyToClipboardEnd"
              value={`${window.location.origin}/survey/${this.props.collectionId}`}
              multiLine={false}
              style={{ height: 14, fontSize: 12, width: 1 }}
              inputStyle={{ textAlign: 'center' }}
            />
            <span onClick={e => this.copyToClipboard('copyToClipboardEnd')}> URL</span>

            &nbsp; &middot; &nbsp;
        <TextField
              id="copyToClipboardEmbed"
              value={`<iframe src="${window.location.origin}/survey/${this.props.collectionId}" height="600" width="100%" frameborder="0"></iframe>`}
              multiLine={false}
              style={{ height: 14, fontSize: 12, width: 1 }}
              inputStyle={{ textAlign: 'center' }}
            />
            <span onClick={e => this.copyToClipboard('copyToClipboardEmbed')}>Embed code </span>

          </div>
        </div>


      </div>)
  }
}


const UserCompareCarousel = observer(({ compareData, users, following, collectionId }) => {
  return (<div style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start' }}>

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

  render() {
    let messengerRefData = "get_started_with_token";
    if (this.props.authToken) {
      messengerRefData += "+auth_token=" + this.props.authToken;
    }
    const loggedFB = this.props.loggedFB;

    return (
        <div className="fbMessage" style={{
          maxHeight: loggedFB.get() ? 400 : 0, display: loggedFB.get() ? 'block' : 'none',
        }}>

          <p>
          <strong>Want to have more say over your future? </strong> You can now vote on issues and track your MP directly from Facebook Messenger. Democracy doesn't get any easier or more powerful!

          </p>
          <MessengerPlugin
            appId={String(window.authSettings.facebookId)}
            pageId={String(window.authSettings.facebookPageId)}
            size="large"
            color="white"
            className="fbiframe"
            passthroughParams={messengerRefData}
          />
        </div>
    )


  }
}




const QuestionResultsCarousel = observer(({ questions, collectionId, countShare }) => {

  return (
    <div>

      <div className="shareLinks" onTouchTap={() => countShare()}>
      <p>Share and compare</p>
      <div className="shareLinksButtons">
          <FacebookShareButton
            url={`${window.location.origin}/survey/${collectionId}`}
            title={`Represent helps you modernise democracy.`}
            picture={`/img/wrW7xwp.png`}
            description={`Compare the policies. Find your match. Make it work for you.`}
            className='fb-network__share-button_group'>
            <FacebookIcon
              size={30}
              round />
          </FacebookShareButton>
          <TwitterShareButton
            url={`${window.location.origin}/survey/${collectionId}`}
            title={`Represent helps you modernise democracy.`}
            picture={`/img/wrW7xwp.png`}
            description={`Compare the policies. Find your match. Make it work for you.`}
            className='fb-network__share-button_group'>
            <TwitterIcon
              size={30}
              round />
          </TwitterShareButton>

          <WhatsappShareButton
            url={`${window.location.origin}/survey/${collectionId}`}
            title={`Represent helps you modernise democracy.`}
            picture={`/img/wrW7xwp.png`}
            description={`Compare the policies. Find your match. Make it work for you.`}
            className='fb-network__share-button_group'>
            <WhatsappIcon
              size={30}
              round />
          </WhatsappShareButton>
        </div>
        </div>

      <Subheader className="heading" >All Results</Subheader>
      <div style={{ display: 'flex', flexFlow: 'column nowrap', justifyContent: 'space-around', alignItems: 'center'}}>


        <div style={{ display: 'flex', flex: 1, flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start'}}>
          {questions.length > 0 &&
            questions.peek().map((question, i) => {
              return (question && question.type == 'Q') ? (
                <div key={`ques-${i}`} style={{}}>
                  <Results questionId={question.object_id} id={i} collectionId={collectionId} />
                </div>
              ) : null
            })}
        </div>
      </div>
    </div>
  )
})


@inject("user", "compareData", 'following', 'UserStore')
@observer
class UserCardSmall extends Component {
  constructor(props) {
    super(props);

    this.areCompareDetailsShowing = observable(false)
    this.state = {
      iconsDisplay: false
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

  toggleSocial = () => {
    let iconsDisplay = !this.state.iconsDisplay;
    this.setState({iconsDisplay})
  }

  countShare = () => {
    this.props.UserStore.countShareClicks({
      analytics_interface: 'collection',
      url: `${window.location.origin}/survey/${this.props.collectionId}`
    })
  }

  clickFB = (e) => {
    document.getElementsByClassName(`fb-network__share-button__end_${this.props.user.id}`)[0].click()
    this.countShare();
    this.toggleSocial();
  }
  clickTW = (e) => {
    document.getElementsByClassName(`twitter-network__share-button__end_${this.props.user.id}`)[0].click()
    this.countShare();
    this.toggleSocial();
  }
  clickWA = (e) => {
    document.getElementsByClassName(`whatsapp-network__share-button__end_${this.props.user.id}`)[0].click()
    this.countShare();
    this.toggleSocial();
  }

  render() {
    // if (!this.props.user) return null;
    if (!this.props.user || !this.props.compareData) return <LoadingIndicator />;

    const { user, UserStore, collectionId } = this.props

    const name = user.first_name ? `${user.first_name} ${user.last_name}` : user.username;
    const age = user.age ? user.age : '';
    const bio = user.bio ? user.bio : '';
    const photo = user.photo ? user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random() * 7)}.png`;;
    const location = (user.country_info ? user.country_info.name + (user.region_info ? ', ' : '') : '') + (user.region_info ? user.region_info.name : '');
    const { count_comments, count_followers, count_following_users, count_group_memberships, count_question_votes, count_votes } = user

    let match = '';
    let questions_counted = null;
    const isCompareDataExist = this.props.compareData.difference_percent !== null;
    if (this.props.compareData) {
      questions_counted = this.props.compareData.questions_counted;
      match = isCompareDataExist ? Math.floor(100 - this.props.compareData.difference_percent) : '-';
    }

    const barStyle = this.areCompareDetailsShowing.get() ? { display: 'block' } : { display: 'none' }

    return (

      this.props &&
      <Card className='scrollbar'>

        <Avatar src={photo} size={50} style={{ alignSelf: 'center', display: 'block', margin: '0 auto', marginTop: '10px' }} />

        <CardTitle title={name} subtitle={location} style={{ textAlign: 'center', padding: '4px 16px', }} titleStyle={{ lineHeight: 1, fontSize: 18, fontWeight: 600 }} />


        <CardText style={{ backgroundColor: '#e6f7ff', padding: '10px 4px', marginTop: 10 }}>
          <h2 style={{ fontSize: '45px', margin: '1px 0', lineHeight: 0.8, textAlign: 'center' }}>{isCompareDataExist ? `${match}%` : '-'}</h2>

          {this.props.compareData ? (
            <div>

              <p style={{ color: '#999', margin: 0, }}>{isCompareDataExist ? `match on ${questions_counted} questions` : 'you need to answer more questions in common'}</p>
              {isCompareDataExist && <MatchBarchart compareData={this.props.compareData} />}
            </div>
          ) : <p></p>}

{/*           <FlatButton
            label={this.areCompareDetailsShowing.get() ? "Hide detail" : 'Show Detail'}
            primary={true}
            style={{ color: '#999', fontSize: 12, lineHeight: 1, textTransform: 'none' }}
            onTouchTap={() => this.areCompareDetailsShowing.set(!this.areCompareDetailsShowing.get())}
          />
        */}
        </CardText>


        <CardText style={{ textAlign: 'center', padding: '8px 16px 0 16px', color: '#444' }} className='cardText'>
          <div style={{ margin: '0' }}>

            <div style={{
                display: this.state.iconsDisplay ? 'flex' : 'none',
                flexFlow: 'row nowrap', justifyContent: 'center', width: '100%'
              }}>

            <div style={{
                display: this.state.iconsDisplay ? 'flex' : 'none',
                flexFlow: 'row nowrap', justifyContent: 'space-around', width: '150px'
              }}>
              <IconButton
                onTouchTap={this.clickFB}
                style={{flex: 1, margin: 'auto', paddingLeft: 10, minWidth: 30, maxWidth: 50, width: 30, cursor: 'pointer'}}
                >
                <FacebookIcon size={30} round={true} />
              </IconButton>
              <IconButton
                onTouchTap={this.clickTW}
                style={{flex: 1, margin: 'auto', paddingLeft: 10, minWidth: 30, maxWidth: 50, width: 30, cursor: 'pointer'}}
                >
                <TwitterIcon size={30} round={true}/>
              </IconButton>
              <IconButton
                onTouchTap={this.clickWA}
                style={{flex: 1, margin: 'auto', paddingLeft: 10, minWidth: 30, maxWidth: 50, width: 30, cursor: 'pointer'}}
                >
                <WhatsappIcon size={30} round={true}/>
              </IconButton>
            </div>

          </div>

            {this.props.following.get() > 0 ?
              <RaisedButton
                label="following"
                primary={true}
                onTouchTap={this.removeFollowing}
                style={{margin: 5,  minWidth: 40  }}
              /> :
              <RaisedButton
                onTouchTap={this.setFollowing}
                style={{ margin: 5,  minWidth: 30, width: 40 }}
                primary={true}
                icon={<Follow />}
              />}

            {isCompareDataExist && <RaisedButton
              onClick={this.openSocial} //open dropdown menu
              onTouchTap={this.toggleSocial}
              style={{ margin: 5, minWidth: 30, width: 40 }}
              primary={true}
              icon={<SocialShare />}
            />}

            {isCompareDataExist && <RaisedButton
            primary={true}
            icon={<ChartIcon />}
            style={{ color: '#999', margin: 5, minWidth: 30, width: 40}}
            onTouchTap={() => this.areCompareDetailsShowing.set(!this.areCompareDetailsShowing.get())}
          />}
          </div>
        </CardText>

        <CardText style={{ backgroundColor: '#e6f7ff', padding: '4px 4px' }}>

          {this.areCompareDetailsShowing.get() ? <div style={barStyle}>
            {/*<CompareUsersDetailsComponent userIds={[this.props.user.id]} />*/}
            <CompareUsersDetails userId={this.props.user.id} userData={this.props.user} />
          </div> : null}
        </CardText>
        <FacebookShareButton
          url={`${window.location.origin}/survey/${collectionId}`}
          title={`I'm a ${match}% match with ${name} - how about you?`}
          picture={`https://share.represent.me/compare_users/compare_users_${UserStore.userData.get('id')}_${user.id}.png`}
          className={`fb-network__share-button__end_${user.id}`}
          description="BTW, this isn't just another party comparison / data sucking thing. It's a really cool new way of doing democracy and giving people a really clear voice. Think petitions, but .. done better :)"
          style={{display: 'none'}}
        >
          <FacebookIcon
            size={32}
            round />
        </FacebookShareButton>
        <TwitterShareButton
          url={`${window.location.origin}/survey/${collectionId}`}
          title={`I'm a ${match}% match with ${name} - how about you?`}
          via='representme'
          hashtags={['representme', 'democracy']}
          className={`twitter-network__share-button__end_${user.id}`}
          style={{display: 'none'}}
        >
          <TwitterIcon
            size={32}
            round />
        </TwitterShareButton>
        <WhatsappShareButton
          url={`${window.location.origin}/survey/${collectionId}`}
          title={`I'm a ${match}% match with ${name}. How about you? BTW, this isn't just another party comparison / data sucking thing. It's a really cool new way of doing democracy and giving people a really clear voice. Think petitions, but .. done better :) `}
          picture={`https://share.represent.me/compare_users/compare_users_${UserStore.userData.get('id')}_${user.id}.png`}
          className={`whatsapp-network__share-button__end_${user.id}`}
          style={{display: 'none'}}
        >
          <WhatsappIcon
            size={32}
            round />
        </WhatsappShareButton>
      </Card>
    )
  }
}


const MatchBarchart = observer(({ compareData }) => {
  let totalCount = 0;
  compareData.difference_distances.map((diff) => totalCount += diff);
  let diffs = compareData.difference_distances;
  let values = {
    strongly_agree: Math.round(1000 * (diffs[0]) / totalCount) / 10,
    agree: Math.round(1000 * (diffs[1]) / totalCount) / 10,
    neutral: Math.round(1000 * (diffs[2]) / totalCount) / 10,
    disagree: Math.round(1000 * (diffs[3]) / totalCount) / 10,
    strongly_disagree: Math.round(1000 * (diffs[4]) / totalCount) / 10
  };

  return (
    <ResponsiveContainer minHeight={20} maxWidth={150} style={{ border: '1px solid red' }}>
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
