import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';

import DynamicConfigService from '../../services/DynamicConfigService';
import ErrorReload from '../ErrorReload';


@inject("UserStore", "CollectionStore") @observer class CollectionIntro extends Component {

  constructor() {
    super();
    this.state = {
      collection: null,
      collectionImageLoaded: false,
      networkError: false
    }
  }

  componentWillMount() {
    let { CollectionStore, match } = this.props
    CollectionStore.getCollectionById(parseInt(match.params.collectionId))
      .then((collection) => {
        this.setState({collection})
      })
      .catch((error) => {
        this.setState({networkError: true})
      })

    this.dynamicConfig = DynamicConfigService;
    if(this.props.match.params.dynamicConfig) {
      this.dynamicConfig.setConfigFromRaw(this.props.match.params.dynamicConfig)
    }
  }

  render() {

    let collectionId = parseInt(this.props.match.params.collectionId);
    let { collection, networkError } = this.state;

    if(networkError) {
      return <ErrorReload message="We couldn't load this collection!"/>
    }else if(!collection) {
      return null
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
      backgroundPosition: 'center'
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

                <Link to={ "/survey/" + collection.id + "/flow/0/" + this.dynamicConfig.encodeConfig() }><RaisedButton label="Start" primary /></Link>
                {this.props.UserStore.userData.has("id") && this.props.CollectionStore.collections.get(collectionId).user.id === this.props.UserStore.userData.get("id") && <Link to={ "/survey/" + collectionId + "/edit" }><RaisedButton label="Edit" primary /></Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  }

}

export default CollectionIntro;
