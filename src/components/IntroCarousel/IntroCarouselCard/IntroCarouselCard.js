import React, { Component } from 'react'
import { observer } from "mobx-react";
import { Card } from 'material-ui/Card';


const IntroCarouselCard = (props) => {


  	return (
      <div>
        {!props && <p>LOADING</p>}
        {props &&
          <div style={{minHeight: 200}}>
            <Card>
              <div style={{display: 'flex', flexFlow: 'row nowrap', justifyContent: 'spaceBetween'}}>
                <div style={{flex: 1, margin: 15,  width: 200, minHeight: 250, border: '2px solid black'}}>
                  <div style={{flex: 1, borderBottom: '2px solid grey', color: 'white', padding: 10, fontWeight: 'bold', minHeight: 70}}>
										{props.num}
                  </div>

                </div>
            </div>
          </Card>
        </div>}
      </div>
    )
  }


export default IntroCarouselCard;
