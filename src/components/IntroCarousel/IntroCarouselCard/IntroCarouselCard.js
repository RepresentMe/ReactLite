import React, { Component } from 'react'
import { observer } from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';



import '../IntroCarousel.css';

const IntroCarouselCard = (props) => {

  const randomPic = `/img/pic${Math.floor(Math.random()*7)}.png`;
  const img = props.img ? props.img.replace("localhost:8000", "represent.me") : randomPic;

  	return (
      <div>
        {!props && <p>LOADING</p>}
        {props && (
          <div>
         
            <img src="{img}" />
 
              {props.text ?
                <div>
                  {props.text.slice(0, 250 + props.text.indexOf(' ')) + ' '}
                  {/* <Link to={ "/survey/" + id }><i>more...</i></Link> */}
                </div>
                : null}
               
 
          </div>)
  }
  </div>)}

export default IntroCarouselCard;