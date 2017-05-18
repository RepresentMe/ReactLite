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

// import IntroCarouselCard from './IntroCarouselCard';



class IntroCarousel extends React.Component {
  state = {
    item: {
      img: './pic3.png',
      text: 'In this snippet just the current value of secondsPassed is passed to the Timer, which is the immutable value 0 (all primitives are immutable in JS). That number wont change anymore in the future, so Timer will never update. It is the property secondsPassed that will'
    },
    modalOpened: true
  }

  closeModal = (e) => {
    e.preventDefault();
    let modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
  }
  render (){
     const actions = [
      <FlatButton
        label="Find out more"
        href="https://represent.me"
        primary={true}
      />,
      <FlatButton
        label="Close"
        primary={true}
        onTouchTap={this.closeModal}
      />,
    ];

    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    //const cellSpacing = width > 400 ? 280 : 100;
    return (
      <Dialog
        open={this.state.modalOpened}
        actions={actions} 
        >
        <div> 
            <div style={{textAlign:'center'}}>
            <img src="https://i0.wp.com/represent.me/wp-content/uploads/results3.png" width="400" />


            <h2>This is a revolution in democracy.</h2>
            <p>Vote, discuss, compare, and delegate your vote to the people you trust.</p>
                
            </div>
          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
