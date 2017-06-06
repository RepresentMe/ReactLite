import React from 'react'

import {Card, CardText} from 'material-ui/Card';
import { cyan600 } from 'material-ui/styles/colors';


import '../IntroCarousel.css';

const IntroCarouselCard = (props) => {

  	return (
      <div>
        {!props && <p>LOADING</p>}
        {props && (

          <div style={{}}>
            <Card
              className='cardStyleIntro'
              style={{display: 'inlineBlock', boxShadow: 'none',backgroundColor: props.backgroundColor}}>

              {props.title &&
                <div>
                  <h2 style={{fontSize: 20, color: 'white', fontWeight: 'bold', position: 'none', display: 'block', textAlign: 'center'}}>{props.title}</h2>
                  <p style={{fontSize: 16, color: 'white', position: 'none', display: 'block', textAlign: 'center', width: '80%'}}>{props.subtitle}</p>
                </div>
                }

              {props.img && <div style={{textAlign: 'center'}}>
                <img src={`/img/introtour/${props.img}`} className='carouselMedia'/>
              </div>}

              <CardText style={{wordWrap: 'break-word', marginTop: 0, color: 'white'}}>
                {props.headerText ?
                  <h3 style={{textAlign: 'center', color: cyan600}}>
                    {props.headerText}
                  </h3>
                  : null}
                {props.text0 ?
                  <p style={{textAlign: 'center', fontSize: 14, color: 'grey', width: '90%'}}>
                    {props.text0}
                  </p>
                  : null}
                {props.text ?
                  <p style={{textAlign: 'center', fontSize: 16, width: '80%'}}>
                    {props.text}
                  </p>
                  : null}
              </CardText>

            </Card>

          </div>)
  }
  </div>)}

export default IntroCarouselCard;
