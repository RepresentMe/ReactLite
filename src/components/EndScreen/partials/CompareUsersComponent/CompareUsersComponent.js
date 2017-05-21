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
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';

import DynamicConfigService from '../../../../services/DynamicConfigService';

import Results from '../ResultsComponent';
import CompareUsersDetailsComponent from '../CompareUsersDetailsComponent';
import './CompareUsers.css';

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

    this.viewData = observable.shallowObject({
      isLoggedIn: observable(null),
      pageReadiness: {
        isCompareUsersReady: observable(false),
        isQuestionResultsReady: observable(false),
      },
      isComparingUsersShowing: observable(false),
      users: observable.shallowArray([]),
      compareData: observable.shallowMap(),
      following: observable.shallowMap(),
      questions: observable.shallowArray(),
      collection_tags: observable.shallowArray([])
    });
  }

  componentDidMount = () => {
    let { CollectionStore, UserStore, collectionId = 1, userIds} = this.props;
    let autorunDispose = autorun(() => {
      if(UserStore.isLoggedIn()) {
        this.viewData.isLoggedIn.set(true);
        console.log('loggedIn', true);
        autorunDispose && autorunDispose();
        this.loadData();
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
        console.log('propUserIds', propUserIds);
        if(propUserIds.length) {
          this.viewData.isComparingUsersShowing.set(true);
          UserStore.amFollowingUsers(currentUserId, propUserIds).then(res => {
            const results = res.results;
            results.forEach(({ following, id }) => this.viewData.following.set(following, id))
          })
          propUserIds.forEach(id => {
            UserStore.getUserById(id).then(res => {
              this.viewData.users.push(res)
            })
            UserStore.compareUsers(currentUserId, id).then(res => {this.viewData.compareData.set(id, res)})
          })
          this.viewData.pageReadiness.isCompareUsersReady.set(true);
        } else {
          this.viewData.pageReadiness.isCompareUsersReady.set(true);
        }
  }

  render() {
    // if (!userIds.length) console.log('No users specified to compare');
    // return <CompareCollectionUsersView data={this.viewData} />
    if (!this.viewData.isLoggedIn.get()) return <SignInToSeeView />;
    console.log('isPageReady', this.isPageReady.get(), this.viewData.pageReadiness.isCompareUsersReady.get()
        , this.viewData.pageReadiness.isQuestionResultsReady.get());


    // TODO make it computed
    if (!(this.viewData.pageReadiness.isCompareUsersReady.get()
        && this.viewData.pageReadiness.isQuestionResultsReady.get())) return <LoadingIndicator />;
    return (<div style={{background: '#f5f5fe'}}>
      {this.viewData.isComparingUsersShowing.get() && <UserCompareCarousel
        compareData={this.viewData.compareData}
        users={this.viewData.users}
        following={this.viewData.following}
      />}
      <MessengerPluginBlock authToken={this.props.UserStore.getAuthToken()} loggedFB={this.props.UserStore.loggedFB}/>
      <QuestionResultsCarousel questions={this.viewData.questions} collectionId={this.props.collectionId}/>
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

const UserCompareCarousel = observer(({compareData, users, following}) => {
  return (<div  style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'space-around', alignItems: 'flex-start'}}>
      
    {compareData && users.map((user) => {
      //console.log('userB, data', user, data)
      return (
        <div key={user.id} >
          <UserCardSmall user={user}
            compareData={compareData.get(user.id)}
            following={observable(following.get(user.id))}/>
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
    <div style={{ borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc',width: '100vw', background: '#fafafa', padding: 5, textAlign: 'center', maxHeight: loggedFB.get() ? 100 : 0}}>
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
    this.state = {
      //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
      checked: [true,true,false,false,false],
      compareDetails: false
    }
  }


  setFollowing = () => {
    this.props.UserStore.setFollowing(this.props.compareData.userb).then((res) => {
      this.props.following.set(res.id);
    })
  }
  removeFollowing = () => {
    this.props.UserStore.removeFollowing(this.props.following.value);
    this.props.following.set(0);
  }
  compare = () => {
    console.log('this.props.user.id', this.props.user.id)
    const compareDetails = !this.state.compareDetails;
    this.setState({compareDetails})
  }

  render(){
    // if (!this.props.user) return null;
    if (!this.props.user) return <LoadingIndicator />;

    const { user } = this.props

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

    const barStyle = this.state.compareDetails ? {display: 'block'} : {display: 'none'}
    //console.log('this.state', this.state, barStyle)
    return (
      this.props &&
      <Card
        style={{margin: '10px', padding: 0, width: 260,  overflowX: 'hidden'}}
        className='scrollbar'
        >

        <Avatar src={photo} size={50} style={{alignSelf: 'center', display: 'block', margin: '0 auto', marginTop: '10px'}}/>

        <CardTitle title={name} subtitle={location} style={{textAlign: 'center'}} />

        <CardText style={{textAlign: 'center', paddingTop: 0, color: '#ccc'}}>
          {bio}
          <div style={{ margin: '10px 0 0 0'}}>
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
              <FlatButton
                label={this.state.compareDetails ? "hide details" : 'Compare in detail'}
                primary={true}
                onTouchTap={this.compare}
                />
            </div>
        </CardText>
        <CardText style={{backgroundColor: '#e6f7ff', padding: '5px 10px'}}> 
          <h2 style={{ fontSize: '45px', margin: '3px 0', lineHeight: 0.8, textAlign: 'center'}}>{`${match}%`}</h2>

          {this.props.compareData ? (
            <div>
              
              <p style={{ color: '#999', margin:0,   }}>{`match on ${questions_counted} questions`}</p>
              <MatchBarchart compareData={this.props.compareData} />
              </div>
            ) : <p></p>} 

            <div style={barStyle}>
              <CompareUsersDetailsComponent userIds={[this.props.user.id]} />
            </div>
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
