import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import LoadingIndicator from '../../../LoadingIndicator';
import Checkbox from 'material-ui/Checkbox';

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
      UserStore.getUserById(id).then((res) => {console.log('userB', res) ; return viewData.users.push(res)})
      UserStore.compareUsers(currentUserId, id).then((res) => {console.log('compareData', res); return viewData.compareData.set(id, res)})
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
        agree: Math.round(1000 *(this.props.compareData.difference_distances[0]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[1]) / totalCount)/10,
        neutral: Math.round(1000 *(this.props.compareData.difference_distances[2]) / totalCount)/10,
        disagree: Math.round(1000 *(this.props.compareData.difference_distances[3]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[4]) / totalCount)/10,
        };
        console.log('values', values)
      }
    }
    return (

      <div>
        {!this.props.compareData || !this.props.compareData.topic_diffs ? <p>loading...</p> :
          <div style={{backgroundColor: '#e6f7ff', padding: 10, maxWidth: 250, margin: '0 auto'}}>

          <div className='containerSmall' style={{justifyContent: 'center', paddingTop: 0}}>
            <div className='innerSmall'>
              <p><img src='/icons/happy_face1.png'/>{` ${values.agree}%`}</p>
            </div>
            <div className='innerSmall'>
              <p><img src='/icons/toll1.png'/>{` ${values.neutral}%`}</p>
            </div>
            <div className='innerSmall'>
              <p><img src='/icons/sad_face1.png'/>{` ${values.disagree}%`}</p>
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
  //console.log('payload', payload)
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
  //console.log(diffs_array)
  return compareData &&
  <div>
    {
      keys.map((k, i) => {
        //console.log(diffs_array[i][k], i)
        return (
          <div key={`BarChart-${i}`}>
            <div style={{padding: 5, height: 14}}>
              <span style={{fontSize: 14, position: 'relative', float: 'left'}}>{`${diffs_array[i][k]['matchPercent']}% on ${k}`}</span>
              <span style={{fontSize: 14, position: 'relative', float: 'right'}}>{`${diffs_array[i][k]['totalCount']}`}</span>
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

//OLD TEMPLATES, PLS DONT KILL
// @inject("user", "compareData", "following", 'UserStore') @observer class CompareInDetail extends Component {
//
//   state = {
//     //0-str.agree, 1-agree, 2-neutral, 3-disagree, 4-str.disagree
//     checked: [true,true,true,true,true],
//     following: this.props.following
//   }
//
//   handleCheck = (e, value) => {
//     switch(e.target.value){
//       case 'disagree': {
//         let checked = this.state.checked;
//         return this.setState({checked: [...checked.slice(0,3), value, value]})
//       }
//       case 'agree': {
//         let checked = this.state.checked;
//         return this.setState({checked: [value, value, ...checked.slice(2)]})
//       }
//       case 'neutral': {
//         let checked = this.state.checked;
//         return this.setState({checked: [...checked.slice(0,2), value, ...checked.slice(3)]})
//       }
//       default: return
//     }
//   }
//   setFollowing = () => {
//     this.props.UserStore.setFollowing(this.props.compareData.userb)
//   }
//   removeFollowing = () => {
//     this.props.UserStore.removeFollowing(this.state.following)
//     this.setState({
//       following: 0
//     })
//   }
//   render(){
//     let name, age, photo, bio,
//       location, count_comments,
//       count_followers, count_following_users,
//       count_group_memberships,
//       count_question_votes, count_votes;
//       let match = '';
//       let totalCount = 0;
//       let values_for_bars = 0;
//       let values = null;
//       let display_all = {};
//
//     if (!this.props && !this.props.compareData.topic_diffs) return null;
//
//     else {
//
//     if (this.props) {
//       name = this.props.user.first_name ? this.props.user.first_name + ' ' + this.props.user.last_name : this.props.user.username;
//       age = this.props.user.age ? this.props.user.age  : '';
//       bio = this.props.user.bio ? this.props.user.bio  : '';
//       photo = this.props.user.photo ? this.props.user.photo.replace("localhost:8000", "represent.me") : `./img/pic${Math.floor(Math.random()*7)}.png`;;
//       location = (this.props.user.country_info ? this.props.user.country_info.name + (this.props.user.region_info ? ', ' : '') : '') + (this.props.user.region_info ? this.props.user.region_info.name : '');
//       count_comments = this.props.user.count_comments
//       count_followers = this.props.user.count_followers
//       count_following_users = this.props.user.count_following_users
//       count_group_memberships = this.props.user.count_group_memberships
//       count_question_votes = this.props.user.count_question_votes
//       count_votes = this.props.user.count_votes
//     }
//
//     if(this.props.compareData && this.props.compareData.topic_diffs) {
//      match = Math.floor(100-this.props.compareData.difference_percent)
//      console.log('match', match)
//     }
//
//     if (this.props.compareData && this.props.compareData.topic_diffs) totalCount = this.props.compareData.difference_distances.reduce((a,b) => a+b,0)
//
//     if (this.props.compareData && this.props.compareData.topic_diffs) {
//
//       values = {
//         agree: Math.round(1000 *(this.props.compareData.difference_distances[0]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[1]) / totalCount)/10,
//         neutral: Math.round(1000 *(this.props.compareData.difference_distances[2]) / totalCount)/10,
//         disagree: Math.round(1000 *(this.props.compareData.difference_distances[3]) / totalCount)/10+Math.round(1000 *(this.props.compareData.difference_distances[4]) / totalCount)/10,
//         };
//       values_for_bars = {
//         strongly_agree: Math.round(1000 *(this.props.compareData.difference_distances[0]) / totalCount)/10,
//         agree: Math.round(1000 *(this.props.compareData.difference_distances[1]) / totalCount)/10,
//         neutral: Math.round(1000 *(this.props.compareData.difference_distances[2]) / totalCount)/10,
//         disagree: Math.round(1000 *(this.props.compareData.difference_distances[3]) / totalCount)/10,
//         strongly_disagree: Math.round(1000 *(this.props.compareData.difference_distances[4]) / totalCount)/10,
//         };
//         console.log('values', values, values_for_bars)
//     }
//     console.log('totalCount.values', totalCount)
//     console.log('totalCount_for_bars', values_for_bars)
//
//     if(this.props.compareData) {
//       let arr =[];
//       let not_arr =[];
//       this.state.checked.map((elt,i) => {
//         if (elt) arr.push(i.toString())
//         else not_arr.push(i.toString())
//       })
//
//       const keys = Object.keys(this.props.compareData.topic_diffs)
//       let ids = []
//       keys.forEach(k => ids.push(this.props.compareData.topic_diffs[k].id))
//       console.log('keys.length', keys.length, keys, ids)
//
//
//       let display = {};
//       keys.map((k)=> {
//         let check1 = false;
//         let check2 = false;
//
//         check1 = arr.map((key,j)=> this.props.compareData.topic_diffs[k].diffs[key] > 0 ? true : false)
//         check1 = check1.includes(true)
//         check2 = not_arr.map((key,j)=> this.props.compareData.topic_diffs[k].diffs[key] === 0 ? true : false)
//         check2 = !check2.includes(false)
//
//
//         if (check1 && check2) display = Object.assign(display, {[k]: this.props.compareData.topic_diffs[k]})
//
//       })
//     display_all = Object.assign(display_all, display);
//
//   }
//     console.log('result', Object.keys(display_all).length, display_all)
//   }
//     return (
//
//       <div>
//         {!this.props.compareData || !this.props.compareData.topic_diffs ? <p>rendering</p> :
//         <Card style={{marginBottom: '20px', border: 'none', minHeight: 500, minWidth: 450, width: 450, maxWidth: 450, margin: 0}}>
//         <CardHeader
//           title={name}
//           subtitle={age ? age + ' years old, ' + location : location}
//           avatar={photo}
//           />
//
//           {/* in reality need to display if i'm following this user */}
//           <div style={{width: '100%', display: 'flex', justifyContent: 'center', margin: '0px 0px 5px 0px'}}>
//           { this.props && this.props.following > 0 ?
//             <FlatButton
//               label="following"
//               primary={true}
//               style={{border: '2px solid green', borderRadius: 10, flex: 1, maxWidth: 120, color: 'green'}}
//               onTouchTap={this.removeFollowing}
//             /> :
//             <FlatButton
//               label="follow"
//               primary={false}
//               style={{border: '2px solid navy', borderRadius: 10, flex: 1, maxWidth: 120, color: 'navy'}}
//               onTouchTap={this.setFollowing}
//               /> }
//             </div>
//
//
//           <div className='container'>
//             <div className='inner'>
//               <p>{count_question_votes}<br/>
//                 <span>Answers</span>
//               </p>
//             </div>
//             <div className='inner'>
//               <p>{count_followers}<br/>
//               <span>Followers</span>
//               </p>
//             </div>
//             <div className='inner'>
//               <p>{count_comments}<br/>
//                 <span>Comments</span>
//               </p>
//             </div>
//
//           </div>
//
//         <div style={{backgroundColor: '#e6f7ff', padding: 10}}>
//           <div>
//             <p style={{fontSize: 26, textAlign: 'center'}}>{`${match}% average agreement`}</p>
//             <p>{`Compared across: ${this.props.compareData.questions_counted} questions`}</p>
//           </div>
//           <MatchBarchartSmallContainer compareData={this.props.compareData}/>
//           {/* <div className='containerSmall' style={{justifyContent: 'center', paddingTop: 0}}>
//             <div className='innerSmall'>
//               <p><img src='/icons/happy_face1.png'/>{` ${values.agree}%`}</p>
//               <CheckboxComponent label='AGREE' fill={labels['strongly_agree']['color']} handleCheck={this.handleCheck} value='agree' checked={this.state.checked[0]}/>
//             </div>
//             <div className='innerSmall'>
//               <p><img src='/icons/toll1.png'/>{` ${values.neutral}%`}</p>
//               <CheckboxComponent label='NEUTRAL' fill={labels['neutral']['color']} handleCheck={this.handleCheck} value='neutral' checked={this.state.checked[2]}/>
//             </div>
//             <div className='innerSmall'>
//               <p><img src='/icons/sad_face1.png'/>{` ${values.disagree}%`}</p>
//               <CheckboxComponent label='DISAGREE' fill={labels['strongly_disagree']['color']} handleCheck={this.handleCheck} value='disagree' checked={this.state.checked[4]}/>
//
//             </div>
//           </div> */}
//
//           {this.props.compareData ? (
//             <div>
//               <MatchBarchart compareData={this.props.compareData} />
//               </div>) : <p></p>}
//
//
//           <CardText style={{paddingTop: 0}}>
//             {Object.keys(display_all).length >0 && (
//               <div className='barContainer'>
//               {Object.keys(display_all)//Object.keys(this.props.compareData.topic_diffs)
//                 .map((d,i)=> {
//
//                   return <li key={`i-${i}`} style={{listStyle: 'none', backgroundColor: 'transparent'}}>
//                     <div>
//                       <div style={{display: 'block', marginLeft: 10, marginBottom: 2}}>
//                         {`On topic: ${d}`}
//                       </div>
//                       <div style={{display: 'block', marginLeft: 10, backgroundColor: 'transparent'}}>
//                         <SmallBarchart values_arr={display_all[d]['diffs']}/> {/* this.props.compareData.topic_diffs[d]['diffs']}/> */}
//                       </div>
//                       </div>
//                     </li>})}
//                 </div>)}
//           </CardText>
//         </div>
//       </Card>}
//     </div>
//   )
// }}


// const MatchBarchart = observer(({ compareData }) => {
//   let totalCount = 0;
//   compareData.difference_distances.map((diff) => totalCount += diff);
//   let diffs = compareData.difference_distances;
//   let values = {
//     strongly_agree: Math.round(1000*(diffs[0])/ totalCount)/10,
//     agree: Math.round(1000*(diffs[1])/ totalCount)/10,
//     neutral: Math.round(1000 *(diffs[2]) / totalCount)/10,
//     disagree: Math.round(1000 *(diffs[3]) / totalCount)/10,
//     strongly_disagree: Math.round(1000*(diffs[4])/ totalCount)/10
//   };
//
//   return (
//     <ResponsiveContainer minHeight={30} maxWidth={150} style={{border: '1px solid red'}}>
//     <BarChart
//       layout="vertical"
//       data={[values]}
//       barGap={1}
//     >
//       <XAxis domain={[0, 100]} hide={true} type="number" />
//       <YAxis type="category" hide={true} />
//       <Bar dataKey="strongly_disagree" stackId="1" fill={labels[Object.keys(values)[4]]['color']} />
//       <Bar dataKey="disagree" stackId="1" fill={labels[Object.keys(values)[3]]['color']} />
//       <Bar dataKey="neutral" stackId="1" fill={labels[Object.keys(values)[2]]['color']} />
//       <Bar dataKey="agree" stackId="1" fill={labels[Object.keys(values)[1]]['color']} />
//       <Bar dataKey="strongly_agree" stackId="1" fill={labels[Object.keys(values)[0]]['color']} />
//       <Tooltip content={<CustomTooltip/>}/>
//     </BarChart>
//   </ResponsiveContainer>
// )
// })


// const SmallBarchart = (props) => {
//   let values = {
//     strongly_agree: props.values_arr[0],
//     agree: props.values_arr[1],
//     neutral: props.values_arr[2],
//     disagree: props.values_arr[3],
//     strongly_disagree: props.values_arr[4]
//   };
//   return (
//     <ResponsiveContainer minHeight={20} maxWidth={150}>
//     <BarChart
//       layout="vertical"
//       barGap={1}
//       data={[values]}
//     >
//       <XAxis domain={[0, 4]} hide={true} type="number" />
//       <YAxis type="category" hide={true} />
//       <Bar dataKey="strongly_disagree" stackId='1' fill={labels[Object.keys(values)[4]]['color']} />
//       <Bar dataKey="disagree" stackId='1' fill={labels[Object.keys(values)[3]]['color']} />
//       <Bar dataKey="neutral" stackId='1' fill={labels[Object.keys(values)[2]]['color']} />
//       <Bar dataKey="agree" stackId='1' fill={labels[Object.keys(values)[1]]['color']} />
//       <Bar dataKey="strongly_agree" stackId='1' fill={labels[Object.keys(values)[0]]['color']} />
//     </BarChart>
//   </ResponsiveContainer>
// )
// }



// const CheckboxComponent = (props) => {
//   const handleCheck = (e, value) =>{
//     props.handleCheck(e, value)
//   }
//   return <div style={{display: 'inline-block'}}>
//           <Checkbox onCheck={handleCheck}
//               label={props.label}
//               labelPosition='right'
//               labelStyle={{color: props.fill, minWidth: 80, fontSize: 12, fontWeight: 'bold'}}
//               value={props.value}
//               checked={props.checked}
//               />
//         </div>
// }

export default CompareCollectionUsers;
