import React, { Component } from 'react'
import { observer, inject } from "mobx-react";
import {Card} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { cyan400, cyan200, grey100 } from 'material-ui/styles/colors';

import ChangeAnswer from 'material-ui/svg-icons/content/undo';
import SocialShare from 'material-ui/svg-icons/social/share';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import IconButton from 'material-ui/IconButton';

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
            <Card style={{width: 240, margin: 10}}>

                <div style={{}}>

                  <div style={{ width: 220, padding: 10,  fontSize: 20, textAlign: 'left', wordWrap: 'break-word'}}>
                    {this.props.data.values[0].title}
                    {/* {this.props.data.values[0].full_name ? <p style={{color: '#999', fontSize: 14, fontWeight: 'bold', textAlign: 'left', }}>{`YOU: ${this.props.data.values[0].full_name}`}</p> : ''}  */}
                  </div>
                  <div style={{color: 'white', fontWeight: 'bold', width: 220, borderBottom: '1px solid #ccc', backgroundColor: this.props.data.values[0].fill, minHeight: 60, padding: 10}}>
										{this.props.data.values[0].full_name ? <span>{}</span> :
										<p style={{color: 'black', fontSize: 16, textAlign: 'left'}}>You didn't answer this question</p>}
                    <p style={{color: 'white', fontWeight: 'bold', fontSize: 35, margin: 0, textAlign: 'left'}}>{`${this.props.data.values[0].percentage}%`}</p>
                    {this.props.data.values[0].full_name ? <p style={{color: 'white', fontSize: 14, textAlign: 'left',  margin: 0, fontWeight: '200', opacity: '0.8'}}>{`${this.props.data.values[0].full_name}`}</p> : ''}
                    {/* <p style={{color: 'white', fontSize: 14, textAlign: 'left',  margin: 0, fontWeight: '200', opacity: '0.8'}}>Agree with you</p> */}
                  </div>
                  <div style={{ width: 240, backgroundColor: "#f5f5fe"}}>
                    <div style={{position: 'relative'}}>
                      <FlatButton label='comments' primary={true} />
                      <div style={{position: 'absolute',
                        top: 10, left: 100, fontSize: 10, borderRadius: '50%',
                        border: `1px solid ${cyan400}`, backgroundColor: cyan200,
                        color: 'white', width: 12, height: 12, textAlign: 'center'}}
                        >
                          {this.props.data.values[0].count_comments}
                      </div>
                      <IconButton tooltip="change answer" touch={true} tooltipPosition="top-center" onTouchTap={(e) => this.redirect(e, 'vote')} style={{position: 'absolute', right: 70, top: -5}}>
                        <ChangeAnswer style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                      <IconButton tooltip="share" touch={true} tooltipPosition="top-center" onTouchTap={(e) => this.redirect(e, 'share')} style={{position: 'absolute', right: 40, top: -5}}>
                        <SocialShare style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                      <IconButton tooltip="results" touch={true} tooltipPosition="top-center" onTouchTap={(e) => this.redirect(e, 'results')} style={{position: 'absolute', right: 5, top: -5}}>
                        <ChartIcon style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                      </IconButton>
                    </div>
                  </div>
                  <div>
                    {this.props.data.values[0].full_name ? <QuestionLiquidPiechart questionId={this.props.data.values[0].questionId} pie={false} endScreen={true}/> : ""}
                  </div>
                </div>

          </Card>
        </div>}
      </div>
    )
  }
}

export default SmallCard;
