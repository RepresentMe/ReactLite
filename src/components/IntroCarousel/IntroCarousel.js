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

//import Carousel from 'nuka-carousel';

// import IntroCarouselCard from './IntroCarouselCard';

const styles = {
  dialogRoot: {  
  },
  dialogContent: {
    width: '90%',
    minWidth: 280,
    maxWidth: 680
  },
  dialogBody: {
    
  }
};

class IntroCarousel extends React.Component {


  closeModal = (e) => {
    e.preventDefault();
    this.props.toggleIntro();
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

    //const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    return (
      <Dialog
        contentStyle={ styles.dialogContent }
        bodyStyle={ styles.dialogBody }
        style={ styles.dialogRoot }
        repositionOnUpdate={ true }
        open={this.props.modalOpened}
        actions={actions}
        >
        <div>
            <div style={{textAlign:'center'}}>
            <img src="https://i0.wp.com/represent.me/wp-content/uploads/results3.png" width="90%" />


            <h2 style={{margin:0}}>This is a revolution in democracy.</h2>
            <p>Vote, discuss, compare, and delegate your vote to the people you trust.</p>

            </div>
          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
