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

import Carousel from 'nuka-carousel';

import IntroCarouselCard from './IntroCarouselCard';
import './IntroCarousel.css';


class IntroCarousel extends React.Component {
  state = {
    items: [
      {id: 0, img: null, text: 'In this snippet just the current value of secondsPassed is passed to the Timer, which is the immutable value 0 (all primitives are immutable in JS). That number wont change anymore in the future, so Timer will never update. It is the property secondsPassed that will'},
      {id: 1, img: null, text: 'The mobx-react package also provides the Provider component that can be used to pass down stores using Reacts context mechanism.'}]
  }
  removeCard = (removeId) => {
    let items = this.state.items;
    items = items.filter((item, i) => item.id !== removeId);
    this.setState({items})
  }
  render (){
    return (
      <Dialog
        open={true}
        >
        <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
          <Carousel
            autoplay={true}
            autoplayInterval={5000}
            wrapAround={true}
            slidesToShow={1}
            slidesToScroll={1}
            cellAlign="center"
            cellSpacing={150}
            dragging={true}
            slideWidth="280px"
            speed={1000}
            style={{minWidth: '90%', maxWidth: '100%', minHeight: 450}}
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
