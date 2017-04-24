import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, extendObservable} from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Rectangle, ResponsiveContainer } from 'recharts';
import LoadingIndicator from '../LoadingIndicator';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';

const labels = {
  "strongly_disagree": {label: "Strongly disagree", color: "rgb(244,56,41)"},
  "disagree": {label: "Disagree", color: "rgb(249,131,117)"},
  "neutral": {label: "Neutral", color: "rgb(128, 128, 128)"},
  "agree": {label: "Agree", color: "rgb(133,202,102)"},
  "strongly_agree": {label: "Strongly Agree", color: "rgb(74,178,70)"}
}

const CompareCollectionUsers = inject("CollectionStore", "UserStore", "QuestionStore")(observer(({ CollectionStore, UserStore, QuestionStore, userIds = [7]}) => {

  let userLoggedIn = true //UserStore.isLoggedIn();
  let currentUserId = 5570//userLoggedIn && UserStore.userData.get("id");
  let viewData = observable.shallowObject({
    isLoggedIn: userLoggedIn,
    users: observable.shallowArray([]),
    compareData: observable.shallowMap()
  });

  if (!userIds.length) console.log('No users specified to compare');
  if (userLoggedIn) {
    userIds.map((id) => {
      UserStore.getUserById(id).then((res) => {console.log('userB', res) ; return viewData.users.push(res)})
      UserStore.compareUsers(currentUserId, id).then((res) => {console.log('compare', res); return viewData.compareData.set(id, res)})
    })
  }

  return <CompareCollectionUsersView data={viewData} />
}))

const CompareCollectionUsersView = observer(({data})=> {
  if (!data.isLoggedIn) return <SignInToSeeView />;
  if (!data.users.length) return <LoadingIndicator />;
  return (
    <div>
    {data.users.map((user) => {
      console.log('userA, data', user, data)
      return (
        <div key={user.id} >
          <UserCard user={user} compareData={data.compareData.get(user.id)}/>
        </div>
      )
    })}
  </div>
)
})

//const UserCard = observer(({user, compareData}) => {
@inject("user", "compareData") @observer class UserCard extends Component {

  state = {
    //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
    checked: [true,true,true,true,true]
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
  render(){
    let name = this.props.user.first_name ? this.props.user.first_name + ' ' + this.props.user.last_name : this.props.user.username;
    const location = (this.props.user.country_info ? this.props.user.country_info.name + (this.props.user.region_info ? ', ' : '') : '') + (this.props.user.region_info ? this.props.user.region_info.name : '');
    const link = "https://app.represent.me/profile/" + this.props.user.id + "/" + this.props.user.username;

    const count_comments = this.props.user.count_comments
    const count_followers = this.props.user.count_followers
    const count_group_memberships = this.props.user.count_group_memberships
    const count_questions = this.props.user.count_questions
    const count_votes = this.props.user.count_votes
    const match_state = {
      4: 'strongly_disagree',
      3: 'disagree',
      2: 'neutral',
      1: 'agree',
      0: 'strongly_agree'
    }
    console.log('this.state', this.state)
    
    if(this.props.compareData) {

      let arr =[];
      arr = this.state.checked.map((elt,i) => {
        if (elt) return i
        else return null})
      console.log('arr', arr)
      //elt.diffs[i]
      console.log(this.props.compareData.topic_diffs)
    }

    if(this.props.compareData) {
      name = name + " " + Math.floor(100-this.props.compareData.difference_percent) + '%'
    }

  return (
    <Card style={{marginBottom: '20px'}}>
      <CardHeader
        title={name}
        subtitle={this.props.user.age + ", " + location}
        avatar={this.props.user.photo.replace("localhost:8000", "represent.me")}
        />
      <Divider/>

      <CardText style={{paddingTop: 0}}>
        <p>{`Followers: ${count_followers}`}</p>
        <p>{`Authored comments: ${count_comments}`}</p>
        <p>{`Groups: ${count_group_memberships}`}</p>
        <p>{`Questions posted: ${count_questions}`}</p>
        <p>{`Votes: ${count_votes}`}</p>
        </CardText>
        <Divider/>
      <CardText style={{paddingTop: 0}}>
        {this.props.compareData ? (
          <div>
            <MatchBarchart compareData={this.props.compareData} />
            <p>{`Compared over: ${this.props.compareData.questions_counted} questions`}</p>
          </div>) : <LoadingIndicator />}
      </CardText>

      {this.props.compareData && (
        <div>
          <CheckboxComponent label='MAINLY DISAGREE' fill={labels['strongly_disagree']['color']} handleCheck={this.handleCheck} value='disagree' checked={this.state.checked[4]}/>
          <CheckboxComponent label='MAINLY AGREE' fill={labels['strongly_agree']['color']} handleCheck={this.handleCheck} value='agree' checked={this.state.checked[0]}/>
          <CheckboxComponent label='NEUTRAL' fill={labels['neutral']['color']} handleCheck={this.handleCheck} value='neutral' checked={this.state.checked[2]}/>
        </div>
    )}

      <CardText style={{paddingTop: 0}}>
        {this.props.compareData && (
          <div>{Object.keys(this.props.compareData.topic_diffs)
            .map((d,i)=>
            <li key={`i-${i}`} style={{listStyle: 'none', backgroundColor: i%2 === 0 ? 'rgb(198,199,202)' : 'white'}}>
              <div>
                <div style={{display: 'inline-block', backgroundColor: 'rgb(242, 242, 242)'}}>
                  <SmallBarchart values_arr={this.props.compareData.topic_diffs[d]['diffs']}/>
                </div>
                <div style={{display: 'inline-block'}}>
                  {`Topic: ${d}`}
                </div>
              </div>
              </li>)}
            </div>)}
      </CardText>
    </Card>
  )
}}
//)

const CheckboxComponent = (props) => {
  const handleCheck = (e, value) =>{
    props.handleCheck(e, value)
  }
  return <div style={{display: 'inline-block'}}>
          <Checkbox onCheck={handleCheck}
              label={props.label}
              labelPosition='right'
              labelStyle={{color: props.fill, minWidth: 150}}
              value={props.value}
              checked={props.checked}
              />
        </div>
}

const CustomTooltip = (props) => {
  const { active } = props;
  const { payload } = props;
  if (active) {
  //console.log('payload', payload)
  return (
      <div style={{backgroundColor: '#f5f5f5', opacity: 0.8, padding: 5, borderRadius: 5}}>
        {payload.map((p,i)=>{
          let name = payload[i].name;
          return <p key={`p-${i}`} style={{color: payload[i].fill, margin: 2}}>{`${name}: ${Math.round(payload[i].payload[name])}%`}</p>
        })
      }
      </div>
    );
  }
  return null;
};

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
    <ResponsiveContainer minHeight={80} maxWidth={150}>
    <BarChart
      layout="vertical"
      data={[values]}
      barGap={1}
    >
      <XAxis domain={[0, 100]} hide={true} type="number" />
      <YAxis type="category" hide={true} />
      <Bar dataKey="strongly_disagree" fill={labels[Object.keys(values)[4]]['color']} />
      <Bar dataKey="disagree" fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="neutral" fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="agree" fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="strongly_agree" fill={labels[Object.keys(values)[0]]['color']} />
      <Tooltip content={<CustomTooltip/>}/>
    </BarChart>
  </ResponsiveContainer>
)
})

const SmallBarchart = (props) => {

  let values = {
    strongly_agree: props.values_arr[0],
    agree: props.values_arr[1],
    neutral: props.values_arr[2],
    disagree: props.values_arr[3],
    strongly_disagree: props.values_arr[4]
  };
  return (
    <ResponsiveContainer minHeight={50} minWidth={50}>
    <BarChart
      barGap={1}
      data={[values]}
    >
      <YAxis domain={[0, 4]} hide={true} type="number" />
      <XAxis type="category" hide={true} />
      <Bar dataKey="strongly_disagree" fill={labels[Object.keys(values)[4]]['color']} />
      <Bar dataKey="disagree" fill={labels[Object.keys(values)[3]]['color']} />
      <Bar dataKey="neutral" fill={labels[Object.keys(values)[2]]['color']} />
      <Bar dataKey="agree" fill={labels[Object.keys(values)[1]]['color']} />
      <Bar dataKey="strongly_agree" fill={labels[Object.keys(values)[0]]['color']} />
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
