import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

import LoadingIndicator from '../../../LoadingIndicator';

import Divider from 'material-ui/Divider';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import { indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import Toggle from 'material-ui/Toggle';
import Avatar from 'material-ui/Avatar';

import Carousel from 'nuka-carousel';

import IntroCarouselCard from './IntroCarouselCard';
import './CompareUsers.css';


const IntroCarousel = (props) => {

  return (
    <Dialog>
    <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center'}}>
      <Carousel
        autoplay={true}
        autoplayInterval={5000}
        //initialSlideHeight={50}
        wrapAround={true}
        slidesToShow={1}
        slidesToScroll={1}
        cellAlign="left"
        cellSpacing={10}
        dragging={true}
        slideWidth="280px"
        speed={500}
        style={{minWidth: '90%', maxWidth: '100%', minHeight: 450}}
        >
      {[1,2,3,4,5].map((num, i) => {
        return (
          <div key={`slide-${i}`} >
            <IntroCarouselCard num={num}/>
          </div>
        )
      })}
      </Carousel>
      </div>
    </Dialog>)
}

export default IntroCarousel;
