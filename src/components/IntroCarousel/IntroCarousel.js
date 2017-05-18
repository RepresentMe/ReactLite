import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import LoadingIndicator from '../LoadingIndicator';

import Divider from 'material-ui/Divider';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import Carousel from 'nuka-carousel';

import IntroCarouselCard from './IntroCarouselCard';
import './IntroCarousel.css';


class IntroCarousel extends React.Component {
  state = {
    item: {
      img: null,
      text: 'In this snippet just the current value of secondsPassed is passed to the Timer, which is the immutable value 0 (all primitives are immutable in JS). That number wont change anymore in the future, so Timer will never update. It is the property secondsPassed that will'
    }
  }

  closeModal = (e) => {
    e.preventDefault();
    this.props.toggleIntro();
  }
  render (){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    
    return (
      <Dialog
        open={this.props.modalOpened}
        style={{padding: 5, minWidth: 400, maxWidth: 680, position: 'none', display: 'block', margin: 'auto'}}
        >
        <div>
          <IconButton onTouchTap={(e)=>this.closeModal(e)}
            style={{position: 'absolute', right: 10, top: 10, color: 'grey'}}
            >
            <ClearIcon />
          </IconButton>
            <div >
              <IntroCarouselCard
                photo={this.state.item.img}
                text={this.state.item.text}
                />
            </div>
          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
