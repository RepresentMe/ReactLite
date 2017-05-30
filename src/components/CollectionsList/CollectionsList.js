import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';
import {Helmet} from "react-helmet";
import RaisedButton from 'material-ui/RaisedButton';
//import smallLogo from './represent_white_outline.svg';

import './CollectionsList.css';
 


const CollectionsList = inject("CollectionStore")(observer(({ CollectionStore }) => {

  if (CollectionStore.collections.size <= 0) {
    return null;
  }

  let collections = CollectionStore.collections.entries();



  return (
    <div>
 


 
        <div style={{background: 'url(http://imgur.com/cO2X2tN.png)', padding: '70px 0 90px 0'}} >
           <div className="imageContainer">
            <div className="contentBox">

                <h1 style={{ maxWidth: '600px', display: '-webkit-inline-box' }}>The 2017 General Election: Who should I vote for?</h1>
               
                <p>Find which party best matches your values, then track and hold them to account during the next five years.</p>

                <RaisedButton label="Start" primary href="/survey/122/flow/0/vote/" style={{marginTop: 15}}/>
                
              </div>
            </div>

        </div>
     





      <div><CollectionSearch /></div>
      <div className='containerStyles'>
      {collections.map((collection_obj) => {
        const id = collection_obj[0];
        const collection = collection_obj[1];
        
        const first_name = collection.user.first_name ? collection.user.first_name : '';
        const last_name = collection.user.last_name ? collection.user.last_name : '';
        const user_name = `${first_name} ${last_name}`;
        const bio = collection.user.bio ? collection.user.bio : '';
        const location = collection.user.country_info ? collection.user.country_info.name : '';
        const randomPic = `./img/pic${Math.floor(Math.random()*7)}.png`;
        const photo = collection.user.photo ? collection.user.photo.replace("localhost:8000", "represent.me") : randomPic;
        const image = collection.photo ? collection.photo.replace("localhost:8000", "represent.me") : null;
        //const link = "https://app.represent.me/profile/" + collection.user.id + "/" + collection.user.username; //our user
        const subtitle = `${bio.substring(0, location ? 77-location.length : 77)}${bio && '...'} ${location}`

        return (

            <Card className='cardStyles' key={ id }>

            <Link to={ "/survey/" + id } >
               {/* <CardHeader
                    title={user_name}
                    subtitle={subtitle}
                    avatar={photo}
                    className='cardHeaderStyle'
                />
              */}

                <CardMedia>
                  <img src={image} className='imgStyle'/>
                </CardMedia>
                <CardTitle
                  className='cardTitle'
                  title={ collection.name }
                />
              </Link>
              <CardText style={{wordWrap: 'break-word'}} className='cardText'>

              <div style={{margin:'0 0 3px 0', fontSize: 11, color: '#999'}}>{collection.question_count} questions</div>
              {collection.desc ?
                <div>
                  {collection.desc.slice(0, 100 + collection.desc.indexOf(' ')) + ' '}
                  <Link to={ "/survey/" + id }><i>more...</i></Link>
                </div>
                : null}
              </CardText>

              <CardActions>
                <Link to={ "/survey/" + id }>
                  <FlatButton label="Start" primary />
                 </Link>
              </CardActions>

            </Card>

        )
      })}
      </div>
      <OgTags />
    </div>
  );
}))

const OgTags = ({}) => {
  const og = {
    url: window.location.origin,
    title: "Let's modernise democracy",
    image: 'https://s3.eu-central-1.amazonaws.com:443/static.represent.me/images/a794ce71-0649-4669-9272-c124eb1c72c6.png',
    desc: "Put your government back on track"
  }
  return (<Helmet>
    <meta property="og:url" content={og.url} />
    <meta property="og:title" content={og.title} />
    <meta property="og:image" content={og.image} />
    <meta property="og:description" content={og.desc} />
  </Helmet>)
}

export default CollectionsList;
