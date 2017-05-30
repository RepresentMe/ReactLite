import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable, extendObservable } from 'mobx';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import LoadingIndicator from '../../../LoadingIndicator';

@inject("UserStore")
@observer
class CompareUsersDetails extends Component {

  constructor(props) {
    super(props);

    this.isCompareDataLoaded = observable(false);
    this.compareData = observable(null);
    this.voteValues = {
      agree: observable(0),
      disagree: observable(0)
    };
    this.topicsCompare = observable.shallowArray([]);
  }

  componentWillMount() {
    const { UserStore, userId } = this.props;
    const currentUserId = UserStore.userData.get("id");

    UserStore.compareUsers(currentUserId, userId).then((compareData) => {
      extendObservable(this.compareData, compareData);
      this.setCompareDataValues(compareData);
      this.isCompareDataLoaded.set(true);
    })
  }

  setCompareDataValues = (compareData) => {
    let totalCount = compareData.difference_distances.reduce((a, b) => a + b, 0);
    totalCount = totalCount == 0 ? 1 : totalCount;
    this.voteValues.agree.set(Math.round(100 * (compareData.difference_distances[0]) / totalCount));
    this.voteValues.disagree.set(Math.round(100 * (compareData.difference_distances[4]) / totalCount));

    let diffs_array = [];
    const keys = Object.keys(compareData.topic_diffs)
    for (let key in compareData.topic_diffs) {
      let totalCount = 0;
      let diff = compareData.topic_diffs[key].diffs;
      let n = 0;
      diff.map((d, i) => {
        n += d * i;
        totalCount += d;
      });
      let values = {
        strongly_agree: Math.round(1000 * (diff[0]) / totalCount) / 10,
        agree: Math.round(1000 * (diff[1]) / totalCount) / 10,
        neutral: Math.round(1000 * (diff[2]) / totalCount) / 10,
        disagree: Math.round(1000 * (diff[3]) / totalCount) / 10,
        strongly_disagree: Math.round(1000 * (diff[4]) / totalCount) / 10
      };
      const matchPercent = Math.floor(100 - 100 * n / totalCount / 4);
      diffs_array.push({
        values,
        name: key,
        id: compareData.topic_diffs[key].id,
        totalCount: totalCount,
        matchPercent: matchPercent
      });
    };
    this.topicsCompare.replace(diffs_array);
  }

  render() {
    const { userData } = this.props;

    return (<div style={{ display: 'flex', flexFlow: 'column nowrap', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexFlow: 'row nowrap', minWidth: 320, maxWidth: 420 }}>
        <div style={{ flex: '1', minWidth: 320 }}>
          <div style={{ backgroundColor: '#e6f7ff', padding: 10, maxWidth: 250, margin: '0 auto' }}>

            <div style={{fontSize:12, margin: '0 0 10px 0', color: '#0d6a88', paddingTop: 0}}>
              {userData.bio}
            </div>


            <div className='container'>
              <div className='inner'>
                <p>{userData.count_question_votes}<br />
                  <span>votes</span>
                </p>
              </div>
              <div className='inner'>
                <p>{userData.count_followers}<br />
                  <span>followers</span>
                </p>
              </div>
              <div className='inner'>
                <p>{userData.count_comments}<br />
                  <span>comments</span>
                </p>
              </div>
            </div>

            {this.isCompareDataLoaded.get() ?
              <div>
                <div className=' ' style={{ textAlign: 'left', paddingTop: 0 }}>
                  <div className=' '>
                    <p>You strongly agree on: {` ${this.voteValues.agree.get()}%`} <br />
                    You strongly disagree on:  {` ${this.voteValues.disagree.get()}%`}</p>
                  </div>
                </div>

                {this.topicsCompare.peek().map((topic) => {
                  return (topic.totalCount> 2 && <div key={`BarChart-${topic.id}`}>
                    <div style={{ padding: 5, height: 6 }}>
                      <span style={{ fontSize: 12, position: 'relative', float: 'left' }}>
                        {`${topic.matchPercent}% on ${topic.name}`}
                      </span>
                      <span style={{ fontSize: 10, position: 'relative', float: 'right', color: '#999' }}>
                        {topic.totalCount}
                      </span>
                    </div>
                    <MatchBarchartSmall values={topic.values} />
                  </div>)
                })}
              </div> :
              <p>loading...</p>}
          </div>
        </div>


      </div>
    </div>)
  }
}

const labels = {
  "strongly_agree": {label: "Strongly Agree", color: "rgb(74,178,70)"},
  "agree": {label: "Agree", color: "rgb(133,202,102)"},
  "neutral": {label: "Neutral", color: "rgb(128, 128, 128)"},
  "disagree": {label: "Disagree", color: "rgb(249,131,117)"},
  "strongly_disagree": {label: "Strongly disagree", color: "rgb(244,56,41)"}
}

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

export default CompareUsersDetails;
