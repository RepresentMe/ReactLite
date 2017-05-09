import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';
import smallLogo from './represent_white_outline.svg';

import './CollectionsList.css';

const styles = {
  containerStyle: {
    padding: 10
  },
  cardStyle: {
    maxWidth: 400,
    margin: '10px auto'
  }
}

const CollectionsList = inject("CollectionStore")(observer(({ CollectionStore }) => {

  if (CollectionStore.collections.size <= 0) {
    return null;
  }

  let collections = CollectionStore.collections.entries();

  return (
    <div>
      <div><CollectionSearch /></div>
      <div style={styles.containerStyle}>
      {collections.map((collection_obj) => {
        const id = collection_obj[0];
        const collection = collection_obj[1];
        const first_name = collection.user.first_name ? collection.user.first_name : '';
        const last_name = collection.user.last_name ? collection.user.last_name : '';
        const user_name = `${first_name} ${last_name}`;
        const bio = collection.user.bio ? collection.user.bio : '';
        const location = collection.user.country_info ? collection.user.country_info.name : '';
        const photo = collection.user.photo ? collection.user.photo.replace("localhost:8000", "represent.me") : smallLogo;
        const image = collection.photo ? collection.photo.replace("localhost:8000", "represent.me") : null;
        //const link = "https://app.represent.me/profile/" + collection.user.id + "/" + collection.user.username; //our user


        return (
          <Link to={ "/survey/" + id }>
            <Card style={styles.cardStyle} key={ id }>

              <CardHeader
                  title={user_name}
                  subtitle={`${bio} ${location}`}
                  avatar={photo}
                  className='cardHeaderStyle'
              />
              <CardMedia>
                <img src={image} className='imgStyle'/>
              </CardMedia>
              <CardTitle
                title={ collection.name }
              />
              <CardText>
                {collection.desc.slice(0, 200 + collection.desc.indexOf(' ')) + ' '}
                <Link to={ "/survey/" + id }><i>more...</i></Link>
              </CardText>
              <CardActions>
                <Link to={ "/survey/" + id }>
                  <FlatButton label="Start" primary />
                 </Link>
              </CardActions>

            </Card>
          </Link>
        )
      })}
      </div>
    </div>
  );
}))

export default CollectionsList;
