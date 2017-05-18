import React, { Component } from 'react'
import { observer } from "mobx-react";
import {Card} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';


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
            <Card style={{height: 240, width: 240, marginBottom: 10}}>

                <div style={{}}>
                  <div style={{color: 'white', fontWeight: 'bold', width: 220, borderBottom: '1px solid #ccc', backgroundColor: this.props.data.values[0].fill, minHeight: 60, padding: 10}}>
										{this.props.data.values[0].full_name ? <span>{}</span> :
										<p style={{color: 'black', fontSize: 16, textAlign: 'left'}}>You didn't answer this question</p>}
                    <p style={{color: 'white', fontWeight: 'bold', fontSize: 35, margin: 0, textAlign: 'left'}}>{`${this.props.data.values[0].percentage}%`}</p>
                    <p style={{color: 'white', fontSize: 14, textAlign: 'left',  margin: 0, fontWeight: '200', opacity: '0.8'}}>Agree with you</p>
                  </div>
                  <div style={{ width: 220, padding: 10,  color: '#999', fontSize: 14, textAlign: 'left', wordWrap: 'break-word'}}>
                    {this.props.data.values[0].title}
                    {this.props.data.values[0].full_name ? <p style={{color: '#999', fontSize: 14, fontWeight: 'bold', textAlign: 'left'}}>{`YOU: ${this.props.data.values[0].full_name}`}</p> : ''}
                  </div>
                  <div style={{position: 'absolute', left: 0, width: 240, paddingBottom: 10, bottom: 0,  borderTop: '1px solid #ccc',}}>
                    <SocialShare style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                    <ChartIcon style={iconStyles} color='#999' hoverColor='#1B8AAE' />
                    <FlatButton label="Comments" primary={true} />
                  </div>
                </div>

          </Card>
        </div>}
      </div>
    )
  }
}

export default SmallCard
