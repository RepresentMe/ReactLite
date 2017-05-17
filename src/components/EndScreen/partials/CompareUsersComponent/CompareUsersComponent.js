import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, autorun, computed } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle, CardMedia} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import LoadingIndicator from '../../../LoadingIndicator';

import MessengerPlugin from 'react-messenger-plugin';

import Divider from 'material-ui/Divider';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import Carousel from 'nuka-carousel';
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
    const propUserIds = [6]//userIds.peek();
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
      <MessengerPluginBlock authToken={this.props.UserStore.getAuthToken()}/>
      <QuestionResultsCarousel questions={this.viewData.questions} />
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
  return (<div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', overflow: "hidden"}}>
    <h2 style={heading} >How you compare</h2>
    <Carousel
      autoplay={true}
      autoplayInterval={5000}
      //initialSlideHeight={50}
      slidesToShow={1}
      slidesToScroll={1}
      cellAlign="left"
      wrapAround={true}
      cellSpacing={15}
      dragging={true}
      slideWidth="280px"
      speed={500}
      style={{ minHeight: 550}}
      >
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
    </Carousel>
  </div>)
})

const MessengerPluginBlock = observer(({authToken}) => {
  let messengerRefData = "get_started_with_token";
  if(authToken) {
    messengerRefData += "+auth_token=" + authToken;
  }
  return (<div style={{flex: '1', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc',width: '100vw', background: '#fafafa', padding: 10, textAlign: 'center'}}>
    <MessengerPlugin
      appId={String(window.authSettings.facebookId)}
      pageId={String(window.authSettings.facebookPageId)}
      size="xlarge"
      passthroughParams={messengerRefData}
    />
  </div>)
})

const QuestionResultsCarousel = observer(({questions}) => {
  return (<div style={{width: '100vw', display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', overflow: "hidden"}}>
    <h2 style={heading} >All results</h2>
      <Carousel
        // autoplay={true}
        autoplayInterval={2000}
        slidesToShow={1}
        slidesToScroll={1}
        wrapAround={true}
        cellAlign="left"
        cellSpacing={15}
        dragging={true}
        slideWidth="240px"
        speed={500}
        style={{minHeight: 400}}
        >

      {questions.length > 0 &&
        questions.peek().map((question, i) => {
          return (
          <div key={`ques-${i}`} style={{}}>
            <Results questionId={question.object_id}/>

          </div>
        )
      })
        }
        </Carousel>
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
        style={{margin: '10px', width: 280, maxHeight: 550, overflowY: 'scroll', overflowX: 'hidden'}}
      >

        <Avatar src={photo} size={50} style={{alignSelf: 'center', display: 'block', margin: '0 auto', marginTop: '10px'}}/>

        <CardTitle title={name} subtitle={location} style={{textAlign: 'center'}} />

        <CardText style={{textAlign: 'center', paddingTop: 0, color: '#ccc'}}>
          {bio}
        </CardText>
        <CardText style={{backgroundColor: '#e6f7ff', padding: '5px 10px'}}>
          {/* <p style={{fontSize: 14, fontWeight: 'bold'}}>How do I compare to {name}?</p> */}
          <h2 style={{ fontSize: '60px', margin: '3px 0', textAlign: 'center'}}>{`${match}%`}</h2>

          {this.props.compareData ? (
            <div>
              <MatchBarchart compareData={this.props.compareData} />
              <p>{`Compared across: ${questions_counted} questions`}</p>
              </div>
            ) : <p></p>}

            <div className='container'>
              <div className='inner'>
                <p>{count_question_votes}<br/>
                  <span>Answers</span>
                </p>
              </div>
              <div className='inner'>
                <p>{count_followers}<br/>
                <span>Followers</span>
                </p>
              </div>
              <div className='inner'>
                <p>{count_comments}<br/>
                  <span>Comments</span>
                </p>
              </div>
            </div>

            <div style={barStyle}>
              <CompareUsersDetailsComponent userIds={[this.props.user.id]} />
            </div>


         {/*  <p>match <Link to={`/compare/${this.props.user.id}`}>(detail)</Link></p> */}

              {/* in reality need to display if i'm following this user */}
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 10px 0px'}}>
                { this.props.following.get() > 0 ?
                  <FlatButton
                    label="following"
                    onTouchTap={this.removeFollowing}
                  /> :
                  <RaisedButton
                    label="follow"
                    backgroundColor="#1B8AAE"
                    onTouchTap={this.setFollowing}
                    /> }
                </div>
        </CardText>

        <CardActions>
          <FlatButton
        label={this.state.compareDetails ? "hide details" : 'show details'}
        primary={true}
        onTouchTap={this.compare}
        />
        </CardActions>
        {/*
        <Dialog
          autoScrollBodyContent={true}
          open={this.state.compareDetails}
          style={{padding: 5, minWidth: 680, maxWidth: 680, width: 680, overflow: 'auto', position: 'none', display: 'block', margin: 'auto'}}
          contentStyle={{width: 500}}
          bodyStyle={{padding: 0, overflowX: 'hidden'}}>

          <div>
          <CardActions>
            <IconButton onTouchTap={this.compare}
              style={{position: 'absolute', right: 5, top: 15, color: 'grey'}}
              >
              <ClearIcon />
            </IconButton>
          </CardActions>

          <CompareUsersDetailsComponent userIds={[this.props.user.id]}/>

          <CardActions>
            <FlatButton
              label="back"
              primary={false}
              onTouchTap={this.compare}
              />
          </CardActions>
          </div>

        </Dialog> */}

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
    <ResponsiveContainer minHeight={30} maxWidth={150} style={{border: '1px solid red'}}>
    <BarChart
      layout="vertical"
      data={[values]}
      barGap={1}
    >
      <XAxis domain={[0, 100]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_disagree" stackId="1" fill={labels[Object.keys(values)[4]]['color']} />
      <Bar dataKey="disagree" stackId="1" fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="neutral" stackId="1" fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="agree" stackId="1" fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="strongly_agree" stackId="1" fill={labels[Object.keys(values)[0]]['color']} />
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
