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

/*
let cardMediaCSS = {
  background: "linear-gradient(135deg, rgba(250,255,209,1) 0%,rgba(161,255,206,1) 100%)",
  height: '200px',
  overflow: 'hidden',
  backgroundSize: 'cover',
}

if(collection.photo) {
  cardMediaCSS.backgroundImage = 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')';
}

let messengerRefData = "get_started_with_token";
let authToken = this.props.UserStore.getAuthToken();
if(authToken) {
  messengerRefData += "+auth_token=" + authToken;
}*/
