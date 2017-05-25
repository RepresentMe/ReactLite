import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import LoadingIndicator from '../../../LoadingIndicator';

import '../CompareUsersComponent/CompareUsers.css';

const labels = {
  "strongly_agree": {label: "Strongly Agree", color: "rgb(74,178,70)"},
  "agree": {label: "Agree", color: "rgb(133,202,102)"},
  "neutral": {label: "Neutral", color: "rgb(128, 128, 128)"},
  "disagree": {label: "Disagree", color: "rgb(249,131,117)"},
  "strongly_disagree": {label: "Strongly disagree", color: "rgb(244,56,41)"}
}

const CompareCollectionUsers = inject("UserStore", "QuestionStore")(observer(({ UserStore, QuestionStore, userIds}) => {

  let userLoggedIn = UserStore.isLoggedIn();
  let currentUserId = userLoggedIn && UserStore.userData.get("id");
  let viewData = observable.shallowObject({
    isLoggedIn: userLoggedIn,
    users: observable.shallowArray([]),
    compareData: observable.shallowMap(),
    following: observable.shallowMap(),
  });

  if (!userIds.length) console.log('No users specified to compare');
  if (userLoggedIn) {

    userIds.map((id) => {
      UserStore.getUserById(id).then((res) => { return viewData.users.push(res)})
      UserStore.compareUsers(currentUserId, id).then((res) => {return viewData.compareData.set(id, res)})
      UserStore.amFollowingUser(currentUserId, id).then((res) => {
        let result = res.results[0] ? res.results[0].id : res.count;
        return viewData.following.set(id, result)
      })
    })
  }


  return <CompareCollectionUsersView data={viewData} />
}))


//View of short compare and short questions info
const CompareCollectionUsersView = observer(({data})=> {
  if (!data.isLoggedIn) return <SignInToSeeView />;
  if (!data.users.length || !data.following || !data.compareData)
    return <LoadingIndicator />;

  return (
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
      <div style={{display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420}}>
      {<div style={{flex: '1', minWidth: 320}}>
        <CompareInDetail user={data.users[0]}
          compareData={data.compareData.get(data.users[0].id)}
          following={data.following.get(data.users[0].id)}
          />
      </div>
    }

    </div>
  </div>)
})


@inject("user", "compareData", "following", 'UserStore') @observer class CompareInDetail extends Component {

  state = {
    //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
    checked: [true,true,true,true,true],
    following: this.props.following
  }

  handleCheck = (e, value) => {
    switch(e.target.value){
      case 'disagree': {
        let checked = this.state.checked;
        return this.setState({checked: [...checked.slice(0,3), value, value]})
      }
      case 'agree': {
        let checked = this.state.checked;
        return this.setState({checked: [value, value, ...checked.slice(2)]})
      }
      case 'neutral': {
        let checked = this.state.checked;
        return this.setState({checked: [...checked.slice(0,2), value, ...checked.slice(3)]})
      }
      default: return
    }
  }
  setFollowing = () => {
    this.props.UserStore.setFollowing(this.props.compareData.userb)
  }
  removeFollowing = () => {
    this.props.UserStore.removeFollowing(this.state.following)
    this.setState({
      following: 0
    })
  }
  render(){
    let name, age, photo, bio,
      location, count_comments,
      count_followers, count_following_users,
      count_group_memberships,
      count_question_votes, count_votes;
      let match = '';
      let totalCount = 0;
      let values = null;
      let display_all = {};

    if (!this.props && !this.props.compareData.topic_diffs) return null;

    else {

    if (this.props) {
      name = this.props.user.first_name ? this.props.user.first_name + ' ' + this.props.user.last_name : this.props.user.username;
      age = this.props.user.age ? this.props.user.age  : '';
      bio = this.props.user.bio ? this.props.user.bio  : '';
      photo = this.props.user.photo ? this.props.user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random()*7)}.png`;;
      location = (this.props.user.country_info ? this.props.user.country_info.name + (this.props.user.region_info ? ', ' : '') : '') + (this.props.user.region_info ? this.props.user.region_info.name : '');
      count_comments = this.props.user.count_comments
      count_followers = this.props.user.count_followers
      count_following_users = this.props.user.count_following_users
      count_group_memberships = this.props.user.count_group_memberships
      count_question_votes = this.props.user.count_question_votes
      count_votes = this.props.user.count_votes
    }

    if (this.props.compareData && this.props.compareData.topic_diffs) {
      match = Math.floor(100-this.props.compareData.difference_percent)
      totalCount = this.props.compareData.difference_distances.reduce((a,b) => a+b,0)
      values = {
        agree: Math.round(1000 *(this.props.compareData.difference_distances[0]) / totalCount)/10,
        neutral: Math.round(1000 *(this.props.compareData.difference_distances[2]) / totalCount)/10,
        disagree: Math.round(1000 *(this.props.compareData.difference_distances[4]) / totalCount)/10
        };
      }
    }
    return (

      <div>
        {!this.props.compareData || !this.props.compareData.topic_diffs ? <p>loading...</p> :
          <div style={{backgroundColor: '#e6f7ff', padding: 10, maxWidth: 250, margin: '0 auto'}}>

          <div style={{fontSize:12, margin: '0 0 10px 0', color: '#0d6a88', paddingTop: 0}}>
          {bio}
          </div>

            <div className='container'>
              <div className='inner'>
                <p>{count_question_votes}<br/>
                  <span>votes</span>
                </p>
              </div>
              <div className='inner'>
                <p>{count_followers}<br/>
                <span>followers</span>
                </p>
              </div>
              <div className='inner'>
                <p>{count_comments}<br/>
                  <span>comments</span>
                </p>
              </div>
            </div>

          <div className=' ' style={{justifyContent: 'center', paddingTop: 0}}>
            <div className=' '>
              <p>You strongly agree on: {` ${values.agree}%`}</p>
              <p>You strongly disagree on: {` ${values.disagree}%`}</p>
            </div>
          </div>

            <MatchBarchartSmallContainer compareData={this.props.compareData}/>
          </div>}
        </div>)
        // <Card style={{marginBottom: '20px', border: 'none', minHeight: 500, minWidth: 450, width: 450, maxWidth: 450, margin: 0}}>
        // <CardHeader
        //   title={name}
        //   subtitle={age ? age + ' years old, ' + location : location}
        //   avatar={photo}
        //   />

          {/*
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 5px 0px'}}>
          { this.props && this.props.following > 0 ?
            <FlatButton
              label="following"
              primary={true}
              style={{border: '2px solid green', borderRadius: 10, flex: 1, maxWidth: 120, color: 'green'}}
              onTouchTap={this.removeFollowing}
            /> :
            <FlatButton
              label="follow"
              primary={false}
              style={{border: '2px solid navy', borderRadius: 10, flex: 1, maxWidth: 120, color: 'navy'}}
              onTouchTap={this.setFollowing}
              /> }
            </div>


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

          </div> */}


      // </Card>}
    // </div>
  // )
}}


const CustomTooltip = (props) => {
  const { active } = props;
  const { payload } = props;
  if (active) {

  return (
      <div style={{backgroundColor: '#f5f5f5', padding: 5, borderRadius: 5}}>
        {payload.map((p,i)=>{
          let name = payload[i].name;
          return <span key={`p-${i}`} style={{color: payload[i].fill, margin: 2}}>{`${name}: ${Math.round(payload[i].payload[name])}%`}</span>
        })
      }
      </div>
    );
  }
  return null;
};

const MatchBarchartSmallContainer = observer(({ compareData }) => {
  let diffs_array = [];
  const keys = Object.keys(compareData.topic_diffs)
  keys.map((key,i) => {
    let totalCount = 0;
    let diff = compareData.topic_diffs[key].diffs;
    let n = 0;
    diff.map((d,i) => {
      n += d * i;
      totalCount += d;
    });
    let values = {
      strongly_agree: Math.round(1000*(diff[0])/ totalCount)/10,
      agree: Math.round(1000*(diff[1])/ totalCount)/10,
      neutral: Math.round(1000 *(diff[2]) / totalCount)/10,
      disagree: Math.round(1000 *(diff[3]) / totalCount)/10,
      strongly_disagree: Math.round(1000*(diff[4])/ totalCount)/10
    };
    const matchPercent = Math.round(100 - 100 * n / totalCount / 4);
    diffs_array.push({[key]: {values: values, totalCount: totalCount, matchPercent: matchPercent}});
  });

  return compareData &&
  <div>
    {
      keys.map((k, i) => {

        return (
          <div key={`BarChart-${i}`}>
            <div style={{padding: 5, height: 6}}>
              <span style={{fontSize: 12, position: 'relative', float: 'left'}}>{`${diffs_array[i][k]['matchPercent']}% on ${k}`}</span>
              <span style={{fontSize: 10, position: 'relative', float: 'right', color: '#999'}}>{`${diffs_array[i][k]['totalCount']}`}</span>
            </div>
            <MatchBarchartSmall values={diffs_array[i][k]['values']}/>
          </div>

      )})
    }
  </div>
})

const MatchBarchartSmall = (values) => {

  return (values &&
    <ResponsiveContainer minHeight={20} maxWidth={100} style={{border: '1px solid red'}}>
    <BarChart
      layout="vertical"
      data={[values.values]}
      barGap={1}
    >
      <XAxis domain={[0, 100]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_agree" stackId="1" fill={labels['strongly_agree']['color']} />
      <Bar dataKey="agree" stackId="1" fill={labels['agree']['color']} />
      <Bar dataKey="neutral" stackId="1" fill={labels['neutral']['color']} />
      <Bar dataKey="disagree" stackId="1" fill={labels['disagree']['color']} />
      <Bar dataKey="strongly_disagree" stackId="1" fill={labels['strongly_disagree']['color']} />
      {/* <Tooltip content={<CustomTooltip/>}/> */}
    </BarChart>
  </ResponsiveContainer>
)
}

const SignInToSeeView = () => {
  return (<div className="sign-in-to-see">
    Sign in to compare your answers to other users
  </div>)
}

export default CompareCollectionUsers;
