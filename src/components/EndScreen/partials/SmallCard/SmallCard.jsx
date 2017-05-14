import React, { Component } from 'react'
import { observer } from "mobx-react";
import { Card } from 'material-ui/Card';

@observer
class SmallCard extends Component {

	render(){
		console.log('SmallCard at bottom props', this.props)

  	return (
      <div>
        {!this.props.data && <p>HELLO</p>}
        {this.props.data.values &&
          <div style={{minHeight: 200}}>
            <Card>
              <div style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'spaceBetween'}}>
                <div style={{flex: 1, margin: 15,  width: 200, height: 250, border: '2px solid black'}}>
                  <div style={{flex: 1, borderBottom: '2px solid grey', color: 'white', padding: 10, fontWeight: 'bold', backgroundColor: this.props.data.values[0].fill, minHeight: 70}}>
                    <p style={{color: 'white', fontSize: 20, textAlign: 'left'}}>Agree with you</p>
                    <p style={{color: 'white', fontSize: 35, textAlign: 'left'}}>{`${this.props.data.values[0].percentage}%`}</p>
                  </div>
                <div style={{flex: 1, height: 50, borderBottom: '1px solid grey, fontSize: 14'}}>
                  <p>{this.props.data.values[0].title}</p>
                </div>
                <div style={{flex: 1, height: 50, borderBottom: '1px solid grey, fontSize: 14'}}>
                  <p> Details [buttons]</p>
                </div>
                </div>
            </div>
          </Card>
        </div>}
      </div>
    )
  }
}

export default SmallCard