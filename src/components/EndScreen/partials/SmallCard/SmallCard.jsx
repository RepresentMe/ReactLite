import React, { Component } from 'react'
import { observer, inject } from "mobx-react";
import {Card} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { cyan400, cyan200, grey100 } from 'material-ui/styles/colors';

import ChangeAnswer from 'material-ui/svg-icons/action/autorenew';
import SocialShare from 'material-ui/svg-icons/social/share';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import IconButton from 'material-ui/IconButton';
import InsertComment from 'material-ui/svg-icons/editor/insert-comment'

import QuestionLiquidPiechart from '../../../charts/QuestionLiquidPiechart';

const iconStyles = {
  marginRight: 10,
  width: 20,
  height: 20,
  position: 'relative',
  top: '7px',
  cssFloat: 'right'
};



@inject("RoutingStore")
@observer
class SmallCard extends Component {
  redirect = (e, tab) => {
    e.preventDefault();
    this.props.RoutingStore.history.push(`${this.props.url}${tab}`)
  }
	render(){
    return (
      <div>
        {!this.props.data && <p></p>}
        {this.props.data.values &&

          <div style={{   }}>
            <Card className="endCard">

                <div style={{}}>

                  <div className='questionTextEnd' style={{ wordWrap: 'break-word'}}>
                    {this.props.data.values[0].title}
                    {/* {this.props.data.values[0].full_name ? <p style={{color: '#999', fontSize: 14, fontWeight: 'bold', textAlign: 'left', }}>{`YOU: ${this.props.data.values[0].full_name}`}</p> : ''}  */}
                  </div>
                  <div style={{marginBottom: 5}}>
                    {this.props.data.values[0].full_name ? <QuestionLiquidPiechart questionId={this.props.data.values[0].questionId} pie={false} endScreen={true}/> : ""}
                  </div>


                    {this.props.data.values[0].full_name ? <span>{}</span> :
                     <div style={{color: 'white', fontWeight: 'bold', width: 220, borderBottom: '1px solid #ccc', backgroundColor: this.props.data.values[0].fill, minHeight: 60, padding: 10}}>
                     <p className='didnotanswer'>No vote. <span className='linkit' onTouchTap={(e) => this.redirect(e, 'vote')}>Answer now?</span></p></div>}

{/*
                     <p style={{color: 'white', fontWeight: 'bold', fontSize: 35, margin: 0, textAlign: 'left'}}>{`${this.props.data.values[0].percentage}%`}</p>
                    {this.props.data.values[0].full_name ? <p style={{color: 'white', fontSize: 14, textAlign: 'left',  margin: 0, fontWeight: '200', opacity: '0.8'}}>{`${this.props.data.values[0].full_name}`}</p> : ''}
*/}


                  <div style={{ width: '100%', backgroundColor: "#f5f5fe", borderTop: '1px solid #ccc', height: 36}}>
                    <div style={{position: 'relative'}}>
                      <IconButton
                        tooltip="comment"
                        touch={true}
                        tooltipPosition="top-center"
                        onTouchTap={(e) => this.redirect(e, 'comments')}
                        iconStyle={{height: 16}}
                        style={{position: 'absolute', left: 0, top: -5}}>
                        <InsertComment style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                      <div style={{position: 'absolute',
                        top: 12, left: 40, fontSize: 10, borderRadius: '50%', color: '#999',}}
                        >
                          {this.props.data.values[0].count_comments}
                      </div>
                      <IconButton
                        tooltip="change answer"
                        touch={true}
                        tooltipPosition="top-center"
                        onTouchTap={(e) => this.redirect(e, 'vote')}
                        iconStyle={{height: 16}}
                        style={{position: 'absolute', right: 65, top: -5}}>
                        <ChangeAnswer style={iconStyles} color='#999' hoverColor='#1B8AAE' style={{height: 16}} />
                      </IconButton>
                      <IconButton
                        tooltip="share"
                        touch={true}
                        tooltipPosition="top-center"
                        onTouchTap={(e) => this.redirect(e, 'share')}
                        iconStyle={{height: 16}}
                        style={{position: 'absolute', right: 35, top: -5}}>
                        <SocialShare style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                      <IconButton
                        tooltip="results"
                        touch={true}
                        tooltipPosition="top-center"
                        iconStyle={{height: 16}}
                        onTouchTap={(e) => this.redirect(e, 'results')}
                        style={{position: 'absolute', right: 0, top: -5}}>
                        <ChartIcon style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                    </div>
                  </div>
                </div>

          </Card>
        </div>}
      </div>
    )
  }
}

export default SmallCard;
