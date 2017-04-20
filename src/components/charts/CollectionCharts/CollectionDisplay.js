import React from 'react';
import { inject, observer  } from "mobx-react";
import { observable } from "mobx";
//import OneLevelPieChartView from './OneLevelPieChartComponent';

const CollectionCharts = (props) => {
  return <CollectionDisplayView {...props}/>
}

@inject("CollectionStore") @observer class CollectionDisplayView extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      showMessengerDialog: true,
      showEmbedDialog: false,
    }
  }

  componentWillMount() {
    console.log(this.props)
    let collectionId = parseInt(this.props.match.params.collectionId);
    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.items(collectionId); // Buffers the questions
    }

    this.props.CollectionStore.items(collectionId);
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let collection = this.props.CollectionStore.collections.get(collectionId);
    console.log('collection', collection)
    if(!collection) {
      return null;
    }



    return (
      <div>
        <p>{collectionId}</p>
        <p>{collection.desc}</p>
        <img src={collection.photo}/>
      </div>
    )
}

}

export default CollectionCharts;
