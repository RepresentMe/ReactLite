import React from 'react';
import { inject, observer  } from "mobx-react";
import { observable } from "mobx";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import QuestionLiquidPiechart from '../QuestionLiquidPiechart';


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
}

render() {
  let collectionId = parseInt(this.props.match.params.collectionId);
  let collection = this.props.CollectionStore.collections.get(collectionId);

  if(!collection) {
    return null;
  }

    return (
      <div>
        {this.props.CollectionStore.collectionItems.has(collectionId) &&
          <CollectionEndQuestionPieCharts collection={collection} items={this.props.CollectionStore.collectionItems.get(collectionId)}/>
        }
      </div>
    )
  }
}

@inject("QuestionStore") @observer class CollectionEndQuestionPieCharts extends React.Component {
  render() {

    return (
      <div>
          <h3 style={{margin: 10, textAlign: 'center'}}>{this.props.collection.name}</h3>
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
    const activeId = this.state.activeId
    if (activeId > 0) {this.setState({activeId: activeId-1})}
    else this.handleMoveRight()

  }
  handleMoveRight = () => {
    const activeId = this.state.activeId
    if (activeId < this.props.items.length-1) {this.setState({activeId: activeId+1})}
    else {this.handleMoveLeft()}
  }
  render (){
    //console.log('props1', this.props);
    return (
      <div style={{position: 'relative'}}>
        <KeyboardArrowLeft style={{position: 'absolute', top: '50%', left: 10, zIndex: 10}} onTouchTap={this.handleMoveLeft}/>
        <KeyboardArrowRight style={{position: 'absolute', top: '50%', right: 10, zIndex: 10}} onTouchTap={this.handleMoveRight}/>
        <CardContainer  {...this.props} activeId={this.state.activeId}/>
      </div>
    )
}}

const CardContainer = (props) => (
    <div>
      {props.items.map((item, index) => {
        if(item.type === "Q" && index === props.activeId) {
          return (
          <Card style={{padding: 10, margin: 5}} key={index}>
            <p style={{margin: 5, textAlign: 'center'}} >{props.QuestionStore.questions.get(item.object_id).question}</p>
            <QuestionLiquidPiechart questionId={item.object_id}/>
          </Card>
          )
        }
      })}
    </div>
)

export default CollectionCharts;
