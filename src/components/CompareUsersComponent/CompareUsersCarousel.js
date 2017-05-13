import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import MessengerPlugin from 'react-messenger-plugin';
import { FacebookButton, TwitterButton } from "react-social";
import Slider from 'react-slick';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import CodeTags from 'material-ui-community-icons/icons/code-tags';
import IconButton from 'material-ui/IconButton';
import { indigo500, blue500, bluegrey500, white } from 'material-ui/styles/colors';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import QuestionPopulationStackedChart from '../charts/QuestionPopulationStackedChart';
import QuestionLiquidPiechart from '../charts/QuestionLiquidPiechart';
import CompareCollectionUsers from '../CompareCollectionUsers';
import DynamicConfigService from '../../services/DynamicConfigService';
import { ResponsiveCollectionContainer } from '../charts/CollectionCharts/CollectionDisplay';
import { AutoRotatingCarousel, Slide } from 'material-auto-rotating-carousel';

const CompareUsersCarousel = (props) => {
  console.log('CompareUsersCarousel', props)
  return (
  <div>
   <AutoRotatingCarousel
     label="Get started"
     open
     autoplay={false}
   >
     <Slide
       media={<div>HELLO</div>}
       mediaBackgroundStyle={{ backgroundColor: 'lime' }}
       contentStyle={{ backgroundColor: 'blue' }}
       title="This is a very cool feature"
       subtitle="Just using this will blow your mind."
     />
     <Slide
       media={<div>HELLO</div>}
       mediaBackgroundStyle={{ backgroundColor: 'lime' }}
       contentStyle={{ backgroundColor: 'blue' }}
       title="This is a very cool feature"
       subtitle="Just using this will blow your mind."
     />
   </AutoRotatingCarousel>
  </div>
  )
}
export default CompareUsersCarousel;
