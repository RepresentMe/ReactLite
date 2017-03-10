import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

@inject("UserStore", "CollectionStore") @observer class CollectionIntro extends Component {

  constructor() {
    super();
    this.state = {
      collectionImageLoaded: false
    }
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let collection = this.props.CollectionStore.collections.get(collectionId);

    if(!collectionId) {
      return null;
    }

    if(!collection) {
      this.props.CollectionStore.getCollection(collectionId);
      return null;
    }

    if(!this.props.CollectionStore.collectionItems.has(collectionId)) {
      this.props.CollectionStore.items(collectionId); // Buffers the questions
    }

    /*

      Three separate layers to control the backround image.
      Outermost div = Image
      Middle div = Black while image is loading, then fades to transparent on image load
      Top div = Radial black gradient overlay

      See img with display: none and onLoad() handler to change state once image loads

    */

    let imageStyle = {
      height: '100%',
      backgroundSize: 'cover',
    }

    let outerStyle = { // Defaults no cover photo
      height: '100%',
      color: 'black',
      transition: 'all 0.5s ease-in-out',
    }

    let innerStyle = { // Defaults no cover photo
      height: '100%',
      overflow: 'scroll',
    }

    if(collection.photo) { // Override if cover photo
      outerStyle.backgroundColor = 'rgba(0,0,0,1)';
      if(this.state.collectionImageLoaded) {
        imageStyle.backgroundImage = 'url(' + collection.photo.replace("localhost:8000", "represent.me") + ')';
        outerStyle.backgroundColor = 'rgba(0,0,0,0)';
      }
      outerStyle.color = 'white';
      innerStyle.background = 'radial-gradient(ellipse at center, rgba(0,0,0,0.5) 50%,rgba(0,0,0,1) 100%)';
    }

    return (
      <div style={imageStyle}>
        <div style={outerStyle}>
          {collection.photo && <img src={collection.photo.replace("localhost:8000", "represent.me")} style={{display: 'none'}} onLoad={() => {this.setState({collectionImageLoaded: true})}} />}
          <div style={innerStyle}>
            <div style={{ display: 'table', width: '100%', height: '100%' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center', width: '100%', padding: '20px 20px'}}>

              <h1>{ collection.name }</h1>
              <ReactMarkdown source={ collection.desc } renderers={{Link: props => <a href={props.href} target="_blank">{props.children}</a>}} />

                <Link to={ "/collection/" + collection.id + "/flow/0" }><RaisedButton label="Start" primary /></Link>
                {this.props.UserStore.userData.has("id") && this.props.CollectionStore.collections.get(collectionId).user.id === this.props.UserStore.userData.get("id") && <Link to={ "/collection/" + collectionId + "/edit" }><RaisedButton label="Edit" primary /></Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }

}

export default CollectionIntro;
