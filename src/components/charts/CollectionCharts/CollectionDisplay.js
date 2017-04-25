import React from 'react';
import { inject, observer  } from "mobx-react";
import { observable } from "mobx";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import IconButton from 'material-ui/IconButton';
import Slider from 'material-ui/Slider';

import QuestionLiquidPiechart from '../QuestionLiquidPiechart';
import CollectionSharingLinks from './CollectionSharingLinks';



const CollectionCharts = (props) => {
  return <CollectionDisplayView {...props}/>
}


@inject("CollectionStore") @observer class CollectionDisplayView extends React.Component {

  constructor(props) {
    super(props);
}

componentWillMount() {
  let collectionId = parseInt(this.props.match.params.collectionId);
  if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
    this.props.CollectionStore.getCollectionItemsById(collectionId);
  }
  //this.props.CollectionStore.getCollection(collectionId);
}

render() {
  let collectionId = parseInt(this.props.match.params.collectionId);
  let collection = this.props.CollectionStore.collections.get(collectionId);

  if(!collection) {
    this.props.CollectionStore.getCollection(collectionId);
    return null;
  }
  //console.log('collection', collection)
    return (
      <div>
        {this.props.CollectionStore.collectionItems.has(collectionId) &&
          <CollectionEndQuestionPieCharts collection={collection} items={this.props.CollectionStore.collectionItems.get(collectionId)}/>
        }

        <CollectionSharingLinks collection={collection} />
      </div>
    )
  }
}

@inject("QuestionStore") @observer class CollectionEndQuestionPieCharts extends React.Component {
  render() {
    //console.log('this.props.collection', this.props.collection)
    return (
      <div>
        <h3 style={{marginLeft: 20, textAlign: 'center', color: 'rgb(0, 172, 193)'}}>{this.props.collection.name}</h3>
        {this.props.collection.photo && <Card style={{padding: 1, margin: 5, minHeight: 100, maxHeight: 180, opacity: 0.8}}>
          <img src={this.props.collection.photo} alt={this.props.collection.name} style={{width: '100%', height: '100%'}}/>
        </Card>}
        <ResponsiveCardContainer {...this.props}/>
      </div>
    )
  }
}


class ResponsiveCardContainer extends React.Component{
  state = {
    activeId: 0
  }

  handleMoveLeft = () => {
    const activeId = this.state.activeId;
    const len = this.props.items.filter((item)=> item.type === "Q").length;
    if (activeId > 0) {this.setState({activeId: activeId-1})}
    else {this.setState({activeId: len-1})}
  }

  handleMoveRight = () => {
    const activeId = this.state.activeId;
    const len = this.props.items.filter((item)=> item.type === "Q").length;
    if (activeId < len -1) {this.setState({activeId: activeId+1})}
    else {this.setState({activeId: 0})}
  }

  handleSlider = (e, value) => {
    this.setState({activeId: value})
  }

  render (){
    let {items} = this.props;
    items = items.filter((item)=> item.type === "Q")
    //console.log(this.state.activeId, items)
    return (
      <div style={{position: 'relative'}}>
        <ArrowLeftContainer handleMoveLeft={this.handleMoveLeft} style={{left: 10}}/>
        <ArrowRightContainer handleMoveRight={this.handleMoveRight} style={{right: 10}}/>
        <CardContainer items={items} activeId={this.state.activeId}/>
        <SliderContainer handleSlider={this.handleSlider} max={items.length-1 > 1 ? items.length-1 : 1} value={this.state.activeId} disabled={items.length-1 === 0}/>
      </div>
    )
}}

const ArrowLeftContainer = (props) => (
  <IconButton onTouchTap={props.handleMoveLeft} style={{position: 'absolute', left: 10, top: '40%'}}>
    <KeyboardArrowLeft style={{margin: '0 auto', zIndex: 10}}/>
  </IconButton>
)

const ArrowRightContainer = (props) => (
  <IconButton onTouchTap={props.handleMoveRight} style={{position: 'absolute', right: 10, top: '40%'}}>
    <KeyboardArrowRight style={{margin: '0 auto', zIndex: 10}}/>
  </IconButton>
)

const SliderContainer = (props) => (
  <Slider onChange={props.handleSlider}
    sliderStyle={{position: 'absolute', bottom: 15, left: '30%', zIndex: 10, width: '40%', margin: 0}}
    defaultValue={0}
    step={1}
    min={0}
    max={props.max}
    value={props.value}
    disabled={props.disabled}
    />
)

const CardContainer = (props) => (
    <div>
      {props.items.map((item, index) => {
        if(index === props.activeId) {
          return (
          <Card style={{padding: 10, margin: 5}} key={index}>
            <QuestionLiquidPiechart questionId={item.object_id}/>
          </Card>
          )
        }
      })}
    </div>
)

export default CollectionCharts;
