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
    items: [
      {id: 0, img: null, text: 'In this snippet just the current value of secondfhia hfdiuahdfiu haiudfhiua sdfhiuahdsfiu ahdiufbhaiu dfbnaisdfnoiansdfqwepjwemnfiuqbweiucnwen lckbhsd fuisdh fiu gdfjhbsd fgahjds fd fd sjkahdfjk hdkjfhjahdf kdjs jkdfh kjasdhf kahdf hasdjkf jkads hfkjads hjhs dfhasdf dsPassed is passed to the Timer, which is the immutable value 0 (all primitives are immutable in JS). That number wont change anymore in the future, so Timer will never update. It is the property secondsPassed that will'},
      {id: 1, img: null, text: 'The mobx-react package also provides the Provider component that can be used to pass down stores using Reacts context mechanism.'}],
    modalOpened: true
  }

  closeModal = (e) => {
    e.preventDefault();
    let modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
  }
  render (){
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const cellSpacing = width > 400 ? 280 : 100;
    const actions = [
      <FlatButton
        label="Close" 
        onTouchTap={this.closeModal}
      />,
      <FlatButton
        label="Next"
        primary={true} 
        onClick={this.props.nextSlide}
        onTouchTap={this.handleClose}
      />,
    ];

 
    return (
      <Dialog
        open={this.state.modalOpened}
        actions={actions}
        >
        <div>
          <IconButton onTouchTap={(e)=>this.closeModal(e)}
            style={{position: 'absolute', right: 10, top: 10, color: 'grey'}}
            >
            <ClearIcon />
          </IconButton>

          <Carousel
            ref="carousel"  
            autoplayInterval={800}
            wrapAround={true}
            slidesToShow={1}
            slidesToScroll={1}
            cellAlign="center"
            cellSpacing={cellSpacing}
            dragging={true} 
            speed={500} 
            >
              {this.state.items.map((item, i) => {
                return (
                  <div key={`slide-${i}`} >
                    <IntroCarouselCard
                      id={item.id}
                      photo={item.img}
                      text={item.text}
                      removeCard={this.removeCard}
                    />
                  </div>
                )
              })}
            </Carousel>
          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;