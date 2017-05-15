import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import LoadingIndicator from '../../../LoadingIndicator';

import Divider from 'material-ui/Divider';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import Carousel from 'nuka-carousel';

import Results from '../ResultsComponent';
import './CompareUsers.css';


const CompareCollectionUsers = inject("CollectionStore", "UserStore", "QuestionStore")(observer(({ CollectionStore, UserStore, QuestionStore, userIds = [100, 7,322,45], collectionId = 1}) => {

  let userLoggedIn = UserStore.isLoggedIn();
  let currentUserId = userLoggedIn && UserStore.userData.get("id");
  let viewData = observable.shallowObject({
    isLoggedIn: userLoggedIn,
    users: observable.shallowArray([]),
    compareData: observable.shallowMap(),
    following: observable.shallowMap(),
    questions: observable.shallowArray()
  });

  // if (!userIds.length) console.log('No users specified to compare');
  if (userLoggedIn) {
    CollectionStore.getCollectionItemsById(collectionId)
      .then((res) => {
        return viewData.questions.push(res)
      })
    userIds.map((id) => {
      UserStore.getUserById(id).then((res) => {
        return viewData.users.push(res)
      })
      UserStore.amFollowingUser(currentUserId, id).then((res) => {
        let result = res.results[0] ? res.results[0].id : res.count;
        return viewData.following.set(id, result)
      })
      UserStore.compareUsers(currentUserId, id).then((res) => {return viewData.compareData.set(id, res)})

    })
  }

  return <CompareCollectionUsersView data={viewData} />
}))


//View of short compare and short questions info
const CompareCollectionUsersView = observer(({data})=> {
  if (!data.isLoggedIn) return <SignInToSeeView />;
  if (!data.questions.length || !data.users.length || !data.following || !data.compareData)
    return <LoadingIndicator />;

  return (
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
      <Carousel
        autoplay={true}
        autoplayInterval={5000}
        //initialSlideHeight={50}
        slidesToShow={1}
        slidesToScroll={1}
        cellAlign="left"
        wrapAround={true}
        cellSpacing={10}
        dragging={true}
        slideWidth="280px"
        speed={500}
        style={{ minHeight: 450}}
        >
      {data.compareData && data.users.map((user) => {
        //console.log('userB, data', user, data)
        return (
          <div key={user.id} >
            <UserCardSmall user={user}
              compareData={data.compareData.get(user.id)}
              following={data.following.get(user.id)}/>
          </div>
        )
      })}
      </Carousel>
    {/* </div> */}
    <div style={{flex: '1'}}>
    <p>Connect with messenger</p>
      <TwitterButton element="span" url=''> {/* {document.referrer}> */}
        <FlatButton
          href="https://github.com/callemall/material-ui"
          target="_blank"
          label="Send to messenger"
          fullWidth={true}
          icon={<TwitterBox color={blue500} />}
          />
      </TwitterButton>
    </div>

    {/* <div style={{display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420, border: '3px solid lime', overflow: 'auto'}}> */}
    {/* <div> */}
    <Carousel
      autoplay={true}
      autoplayInterval={2000} 
      slidesToShow={1}
      slidesToScroll={1}
      wrapAround={true}
      cellAlign="left"
      cellSpacing={20}
      dragging={true}
      slideWidth="240px"
      speed={500}
      style={{minHeight: 400}}
      >
    {data.questions.length > 0 &&
      data.questions[0].map((question, i) => {
        {/*console.log('question', question)*/}
      return (
        <div key={`ques-${i}`} style={{}}>
          <Results questionId={question.object_id}/>
        </div>
      )
    })
      }
      </Carousel>
    {/* </div> */}

    <CardText>
      <p style={{textAlign: 'left'}}>Your interests</p>
      <p style={{textAlign: 'left'}}>Would you like to see more of any of these?</p>
      <a href='#' style={{textDecoration: 'underline'}}>(Browse all topics)</a>

      <div style={{marginTop: 10}}>
        <Toggle
          label="Politics"
          style={{marginBottom: 0, }}
        />
        <Toggle
          label="War"
          style={{marginBottom: 0}}
        />
        <Toggle
          label="Education"
          defaultToggled={true}
          style={{marginBottom: 0}}
        />
      </div>

  </CardText>
</div>

)
})


@inject("user", "compareData", "following", 'UserStore') @observer class UserCardSmall extends Component {

  state = {
    //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
    checked: [true,true,false,false,false]
  }

  setFollowing = () => {
    this.props.UserStore.setFollowing(this.props.compareData.userb)
  }
  removeFollowing = () => {
    this.props.UserStore.removeFollowing(this.props.following)
  }
  render(){
    // if (!this.props.user) return null;
    if (!this.props.user) return <LoadingIndicator />;
    let name, age, photo, bio,
      location, count_comments,
      count_followers, count_following_users,
      count_group_memberships,
      count_question_votes, count_votes;
    if (this.props.user) {
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
    let match = '';
    if(this.props.compareData) {
     match = Math.floor(100-this.props.compareData.difference_percent)
    }


    return (
      this.props &&
      <Card style={{margin: '10px', width: 280}}>
        <Avatar src={photo} size={50} style={{alignSelf: 'center', marginTop: '10px', display: 'block', margin: '0 auto'}}/>

        <CardTitle title={name} subtitle={location} style={{textAlign: 'center'}} />

        <CardText style={{textAlign: 'center', paddingTop: 0, color: '#ccc'}}>
          {bio}
        </CardText>
        <CardText style={{backgroundColor: '#e6f7ff', padding: '5px 10px'}}>
          {/* <p style={{fontSize: 14, fontWeight: 'bold'}}>How do I compare to {name}?</p> */}
          <h2 style={{ fontSize: '60px', margin: '3px 0', textAlign: 'center'}}>{`${match}%`}</h2>


         {/*  <p>match <Link to={`/compare/${this.props.user.id}`}>(detail)</Link></p> */}

              {/* in reality need to display if i'm following this user */}
              <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 10px 0px'}}>
                { this.props && this.props.following > 0 ?
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
        //onTouchTap={this.compare}
        />
        </CardActions>


    </Card>
  )
}}

const SignInToSeeView = () => {
  return (<div className="sign-in-to-see">
    ..
  </div>)
}

export default CompareCollectionUsers;
