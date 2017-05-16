import React, { Component } from 'react'
import { observer } from "mobx-react";
import {Card, CardActions, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import SvgIcon from 'material-ui/SvgIcon';
import Divider from 'material-ui/Divider';

import SocialShare from 'material-ui/svg-icons/social/share';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';


const iconStyles = {
  marginRight: 10,
  width: 20,
  height: 20,
  position: 'relative',
  top: '7px',
  cssFloat: 'right'
};

@observer
class SmallCard extends Component {

	render(){
  	return (
      <div>
        {!this.props.data && <p></p>}
        {this.props.data.values &&

          <div style={{   }}>
            <Card style={{height: 280, width: 240, marginBottom: 10}}>

                <div style={{ borderBottom: '1px solid #ccc', color: 'white', padding: '10px 10px 0 10px', backgroundColor: this.props.data.values[0].fill, minHeight: 70}}>
                  <div style={{flex: 1, borderBottom: '1px solid #ccc', color: 'white', padding: 10, fontWeight: 'bold', backgroundColor: this.props.data.values[0].fill, minHeight: 70}}>
										
                    <p style={{color: 'white', fontWeight: 'bold', fontSize: 35, margin: 0, textAlign: 'left'}}>{`${this.props.data.values[0].percentage}%`}</p>
                    <p style={{color: 'white', fontSize: 14, textAlign: 'left',  margin: 0, fontWeight: '200', opacity: '0.8'}}>Agree with you</p>
                  </div>
                  <div style={{ width: 220, padding: 10, color: '#999', fontSize: 16, textAlign: 'left', wordWrap: 'break-word'}}>
                    {this.props.data.values[0].title}
                  </div>
                  <div style={{position: 'absolute', left: 0, width: 240, paddingBottom: 10, bottom: 0,  borderTop: '1px solid #ccc',}}>
                    <SocialShare style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                    <ChartIcon style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                    <FlatButton label="Comments" primary={true} />
                  </div>
                </div>

  {/*  <CardText>
    You are in the majority. [OR IF AGREE < 50%]
      You are in the minority. Say why.
    </CardText>
    <CardTitle title={`${this.props.data.values[0].percentage}%`} subtitle="Agree with you" style={{backgroundColor: this.props.data.values[0].fill, color: 'white'}} />
    <CardText style={{fontSize: '16px', fontWeight: '200', color: '#999'}}>
      {this.props.data.values[0].title}
    </CardText>
    <Divider />
    <CardActions>
      <SocialShare style={iconStyles} color='#999' hoverColor='#1B8AAE' />
      <ChartIcon style={iconStyles} color='#999' hoverColor='#1B8AAE' />
      <FlatButton label="Comment" primary={true} />
    </CardActions>
    */}


          </Card>
        </div>}
      </div>
    )
  }
}

export default SmallCard
