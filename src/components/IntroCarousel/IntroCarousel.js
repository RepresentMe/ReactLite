import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { observable } from 'mobx';
import { Link } from 'react-router-dom';
import {Card, CardHeader, CardText, CardActions, CardTitle} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import TwitterBox from 'material-ui-community-icons/icons/twitter-box';
import { TwitterButton } from "react-social";
import { blue700, cyan700, tealA700, indigoA200, greenA700, red400, indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import ClearIcon from 'material-ui/svg-icons/content/clear';

import Carousel from 'nuka-carousel';

import IntroCarouselCard from './IntroCarouselCard';
import './IntroCarousel.css';



class IntroCarousel extends React.Component {
  state = {
    items: [
      {id: 0, backgroundColor: 'white', title: '', subtitle: "", img: 'hands_curve.jpg', headerText: "Welcome!", text0: "It looks like you've not used Represent before. Let's take a quick tour.", button: null},
      {id: 1, backgroundColor: '#1B8AAE', title: "Represent is the people's political platform.", subtitle: "",  headerText: " ", text: "Our mission together is to modernise democracy and help you guide representatives to make wise and informed decisions. ", button: null},
      {id: 2, backgroundColor: greenA700, title: 'Powerful discussion tools', subtitle: "", img: 'debate.gif', headerText: "", text: "Build your reputation by making good points, voting on comments, and sharing solutions and useful information.", button: null},
      {id: 3, backgroundColor: tealA700, title: 'Change your mind', subtitle: "", img: 'changemind.gif', headerText: "", text: "You can change your mind any time you like - and remember it's a good thing to do - it proves you're thinking!", button: null},
      {id: 4, backgroundColor: red400, title: 'Answer privately', subtitle: "", img: 'private.gif', headerText: "", text: "You can also edit your settings to make all your answers private — (though you will lose the ability to compare yourself if you do this!)", button: null},
      {id: 5, backgroundColor: cyan700, title: 'Compare with others', subtitle: "", img: 'compare.png', headerText: "", text: "When you’ve answered more 20-30 questions you can see compare to friends, locals, and people in 57 countries around the world!", button: null},
      {id: 6, backgroundColor: indigoA200, title: 'Right here if you need help!', subtitle: "", img: 'help.gif', headerText: "", text: "Click 'help' on your profile menu (top right!) and we'll be with you as soon as we can!", button: null},
      ],
    //modalOpened: true,
    step: 0
  }

  closeModal = (e) => {
    e.preventDefault();
    this.setState({step: 0})
    this.props.toggleIntro();
  }
  navigateNext = (e) => {
    e.preventDefault();
    let step = this.state.step + 1;
    this.setState({step})

  }

  render (){
    const modalOpened = this.props.modalOpened;
    const item = this.state.items.filter(item => item.id === this.state.step)[0]
    const actions = item.id !== (this.state.items.length - 1) ? [
       <FlatButton
         label="Close"
         onTouchTap={(e)=>this.closeModal(e)}
       />, 
       <FlatButton
         label="Next"
         primary={true}
         onTouchTap={(e)=>this.navigateNext(e)}
       />,
       ] : [
        <FlatButton
          label="Close"
          onTouchTap={(e)=>this.closeModal(e)}
        />
      ]
       ;
    return (

      <Dialog
        open={modalOpened}
        actions={actions}
        autoScrollBodyContent={true}
        className="introslides"
        contentClassName="introslidesBody"
        bodyStyle={{backgroundColor: item.backgroundColor}}
        >
        <div>
          <div key={`slide-${this.state.step}`} >
            <IntroCarouselCard
              id={item.id}
              title={item.title}
              subtitle={item.subtitle}
              img={item.img}
              headerText={item.headerText}
              text0={item.text0}
              text={item.text}
              backgroundColor={item.backgroundColor}
              //removeCard={this.removeCard}
            />
          </div>

          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
