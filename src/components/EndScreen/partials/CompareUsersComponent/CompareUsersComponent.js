import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
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

@inject("CollectionStore", "UserStore", "QuestionStore")
@observer
class CompareCollectionUsers extends Component {

  // componentWilReceiveProps(nextProps) {
    // if(nextProps.userIds.peek() != this.props.userIds) {

    // }
  // }

  render() {
    let { CollectionStore, UserStore, QuestionStore, collectionId = 1} = this.props;
    const path = window.location.pathname;
    const parsed = parseInt(path.slice(path.indexOf('survey/') + 7, path.indexOf('survey/', path.indexOf('survey/') + 8) + path.indexOf('/')))
    collectionId = parsed ? parsed : 1
    const propUserIds = this.props.userIds.peek();
    const userIds = propUserIds;
    let userLoggedIn = UserStore.isLoggedIn();
    let currentUserId = userLoggedIn && UserStore.userData.get("id");
    let viewData = observable.shallowObject({
      isLoggedIn: userLoggedIn,
      users: observable.shallowArray([]),
      compareData: observable.shallowMap(),
      following: observable.shallowMap(),
      questions: observable.shallowArray(),
      collection_tags: observable.shallowArray([])
    });

    // if (!userIds.length) console.log('No users specified to compare');
    if (userLoggedIn) {
      CollectionStore.getCollectionItemsById(collectionId)
        .then((res) => {
          return viewData.questions.push(res)
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

        if(userIds.length) {
          UserStore.amFollowingUsers(currentUserId, userIds).then(res => {
            const results = res.results;
            results.forEach(({ following, id }) => viewData.following.set(following, id))
          })
          userIds.forEach(id => {
            UserStore.getUserById(id).then(res => {
              viewData.users.push(res)
            })

          UserStore.compareUsers(currentUserId, id).then(res => {viewData.compareData.set(id, res)})
        
        })
      }
    }

    return <CompareCollectionUsersView data={viewData} />
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


//View of short compare and short questions info
@inject("UserStore", "data")
@observer
class CompareCollectionUsersView extends Component {
  state={
    tagsOpened: false
  }

  // openTags = () => {
  //   const tagsOpened = !this.state.tagsOpened;
  //   this.setState({tagsOpened})
  // }
  // followTag = (tagId, following) => {
  //   if (following) {
  //       window.API.post(`/api/tags/${tagId}/follow/`)
  //         .then((response) => {})
  //         .catch((error) => {
  //           console.log(error);
  //         })
  //     }
  //     else {
  //       window.API.post(`/api/tags/${tagId}/unfollow/`)
  //         .then((response) => {})
  //         .catch((error) => {
  //           console.log(error);
  //         })
  //     }}

  render() {
    const {data, UserStore} = this.props;
    if (!data.isLoggedIn) return <SignInToSeeView />;
    if (!data.questions.length || !data.following)
      return <LoadingIndicator />;


    let messengerRefData = "get_started_with_token";
    const authToken = this.props.UserStore.getAuthToken();
    if(authToken) {
      messengerRefData += "+auth_token=" + authToken;
    }

    // let tagsLength = 3;
    // if (data.collection_tags && this.state.tagsOpened){
    //   tagsLength = data.collection_tags[0].length;
    // }

    return (
      <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', background: '#f5f5fe'}}>
        {data.compareData.keys().length>0 && <div>
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
            style={{ minHeight: 480}}
            >
          {data.compareData && data.users.map((user) => {
            //console.log('userB, data', user, data)
            return (
              <div key={user.id} >
                <UserCardSmall user={user}
                  compareData={data.compareData.get(user.id)}
                  following={observable(data.following.get(user.id))}/>
              </div>
            )
          })}
          </Carousel>
        </div>}


      <div style={{flex: '1', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc',width: '100vw', background: '#fafafa', padding: 10, textAlign: 'center'}}>
        <MessengerPlugin
          appId={String(window.authSettings.facebookId)}
          pageId={String(window.authSettings.facebookPageId)}
          size="xlarge"
          passthroughParams={messengerRefData}
        />
      </div>



      <h2 style={heading} >All results</h2>
      <Carousel
        autoplay={true}
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

      {data.questions.length > 0 &&
        data.questions[0].map((question, i) => {
          return (
          <div key={`ques-${i}`} style={{}}>
            <Results questionId={question.object_id}/>

          </div>
        )
      })
        }
        </Carousel>



      {/* <h2 style={heading} >Your interests</h2>
      <p>Would you like to see more of any of these?</p>
      <CardText>
        <a href='#' style={{textDecoration: 'underline'}} onTouchTap={this.openTags}>See all</a>
        {this.props.data.collection_tags[0] && this.props.data.collection_tags[0].length &&
          this.props.data.collection_tags[0].slice(0, tagsLength).map((tag, i) => {

          return (
            <div key={`tag-${i}`} style={{marginTop: 10}}>
              <Toggle
                defaultToggled={tag.following}
                label={tag.text}
                style={{marginBottom: 0, }}
                onToggle={() => this.followTag(tag.id, tag.following)}
              />
            </div>
          )
        })}
    </CardText> */}
  </div>

)}
}


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

    return (
      this.props &&
      <Card style={{margin: '10px', width: 280}}>
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
        label="compare"
        primary={true}
        onTouchTap={this.compare}
        />
        </CardActions>
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

        </Dialog>

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
