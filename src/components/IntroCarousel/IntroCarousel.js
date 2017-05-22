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
import { blue700, cyan700, tealA700, indigoA200, greenA700, red400, indigo500, blue500, bluegrey500 } from 'material-ui/styles/colors';
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
      {id: 0, backgroundColor: 'white', title: '', subtitle: '', img: 'hands_curve.jpg', headerText: "Time is precious. Let's take a quick tour to make sure you get the most out of Represent.", text0: "Represent revolutionises how we can make decisions. Because it's designed around people (and not politicians or organisations), it gives you a clear voice everywhere decisions are being made in your name: From local to global, where you live or where you work, and in organisations you support.", button: null},
      {id: 1, backgroundColor: blue700, title: 'Powerful insights', subtitle: "Click Insights for detailed local analysis", img: 'results.gif', headerText: "", text: "Zoom and click the map to filter results and debate to just a local area.", button: null},
      {id: 2, backgroundColor: greenA700, title: 'Powerful discussion tools', subtitle: "", img: 'debate.gif', headerText: "", text: "Build your reputation by making good points, voting on comments, and sharing solutions and useful information.", button: null},
      {id: 3, backgroundColor: tealA700, title: 'Change your mind', subtitle: "", img: 'changemind.gif', headerText: "", text: "You can change your mind any time you like - and remember it's a good thing to do - it proves you're thinking!", button: null},
      {id: 4, backgroundColor: red400, title: 'Answer privately', subtitle: "", img: 'private.gif', headerText: "", text: "You can also edit your settings to make all your answers private — (though you will lose the ability to compare yourself if you do this!)", button: null},
      {id: 5, backgroundColor: cyan700, title: 'Compare with others', subtitle: "", img: 'compare.png', headerText: "", text: "When you’ve answered more 20-30 questions you can see compare to friends, locals, and people in 57 countries around the world!", button: null},
      {id: 6, backgroundColor: indigoA200, title: 'Right here if you need help!', subtitle: "", img: 'help.gif', headerText: "", text: "Click 'help' on your profile menu (top right!) and we'll be with you as soon as we can!", button: null},
      ],
    modalOpened: true,
    step: 0
  }

  closeModal = (e) => {
    e.preventDefault();
    let modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
  }
  navigateNext = (e) => {
    e.preventDefault();
    let step = this.state.step + 1;
    this.setState({step})
    if (step === this.state.items.length) {
      step = 0
    }
  }

  render (){

    //const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    const item = this.state.items.filter(item => item.id === this.state.step)[0]
    console.log(item)
    return (
      <Dialog
        open={this.state.modalOpened}
        bodyStyle={{backgroundColor: item.backgroundColor}}
// =======
//     const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
//     const cellSpacing = width > 400 ? 280 : 100;
//     const actions = [
//       <FlatButton
//         label="Close"
//         onTouchTap={this.closeModal}
//       />,
//       <FlatButton
//         label="Next"
//         primary={true}
//         onClick={this.props.nextSlide}
//         onTouchTap={this.handleClose}
//       />,
//     ];
//
//
//     return (
//       <Dialog
//         open={this.state.modalOpened}
//         actions={actions}
// >>>>>>> ee0794b2531b3b1951660837d37451512f44abce
        >
        <div>
          <IconButton onTouchTap={(e)=>this.closeModal(e)}
            style={{position: 'absolute', right: 10, top: 5, color: 'grey'}}
            >
            <ClearIcon />
          </IconButton>


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
          <div style={{height: 50, width: '100%'}}>
            {this.state.step === this.state.items.length - 1 ?
              <RaisedButton
                label="continue"
                onTouchTap={(e)=>this.closeModal(e)}
                style={{position: 'absolute', right: 20, bottom: 15}}
                />
                : <FlatButton
                label="next"
                onTouchTap={(e)=>this.navigateNext(e)}
                style={{position: 'absolute', right: 20, bottom: 15}}
              />}
          </div>

{/* =======
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
>>>>>>> ee0794b2531b3b1951660837d37451512f44abce */}
          </div>
      </Dialog>
    )
  }
}

export default IntroCarousel;
