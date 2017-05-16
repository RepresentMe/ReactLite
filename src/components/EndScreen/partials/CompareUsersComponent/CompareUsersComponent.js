import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import LoadingIndicator from '../../../LoadingIndicator';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import Carousel from 'nuka-carousel';

import Results from '../ResultsComponent';
import './CompareUsers.css';


const CompareCollectionUsers = inject("CollectionStore", "UserStore", "QuestionStore")
      (observer(({ CollectionStore, UserStore, QuestionStore, userIds = [100, 7, 322, 45], collectionId = 1}) => {

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

  return <CompareCollectionUsersView data={viewData} />
}))

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
const CompareCollectionUsersView = observer(({data})=> {
  if (!data.isLoggedIn) return <SignInToSeeView />;
  if (!data.questions.length || !data.users.length || !data.following || !data.compareData)
    return <LoadingIndicator />;

  return (
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', background: '#f5f5fe'}}>
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
        style={{ minHeight: 450}}
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
    {/* </div> */}

 
    <div style={{flex: '1', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc',}}>
    <p>Connect with messenger</p>
    </div>
 

    {/* <div style={{display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420, border: '3px solid lime', overflow: 'auto'}}> */}
    {/* <div> */}

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
      style={{minHeight: 260}}
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


    <h2 style={heading} >Your interests</h2>
    <p>Would you like to see more of any of these?</p>

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


@inject("user", "compareData", 'following', 'UserStore') 
@observer 
class UserCardSmall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
      checked: [true,true,false,false,false]
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
