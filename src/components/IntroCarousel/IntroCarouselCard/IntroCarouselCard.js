import React, { Component } from 'react'
import { observer } from "mobx-react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';


import '../IntroCarousel.css';

const IntroCarouselCard = (props) => {

  const randomPic = `/img/pic${Math.floor(Math.random()*7)}.png`;
  const img = props.img ? props.img.replace("localhost:8000", "represent.me") : randomPic;

  	return (
      <div>
        {!props && <p>LOADING</p>}
        {props && (
          <div>
            <Card
              className='cardStyleIntro'
              style={{display: 'inlineBlock'}}>

            <CardHeader
                  avatar={<Avatar
                    src={img}
                    size={30}
                    style={{
                      height: '80px',
                      width: '80px',
                      verticalAlign: 'middle',
                      position: 'none', display: 'block', margin: '0 auto',
                      borderRadius: 5
                    }}
                  />}
                  className='cardHeaderStyleIntro'
              />

              <CardActions>
                <IconButton onTouchTap={() => props.removeCard(props.id)}
                  style={{position: 'absolute', right: 0, top: -130, color: 'grey'}}
                  >
                  <ClearIcon />
                </IconButton>
              </CardActions>

              <CardText style={{wordWrap: 'break-word', marginTop: 0}}>
              {props.text ?
                <div>
                  {props.text.slice(0, 250 + props.text.indexOf(' ')) + ' '}
                  {/* <Link to={ "/survey/" + id }><i>more...</i></Link> */}
                </div>
                : null}
              </CardText>

            </Card>
          </div>)
  }
  </div>)}

export default IntroCarouselCard;
