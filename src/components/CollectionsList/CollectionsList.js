import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';

const styles = {
  cardStyle: {
    margin: '10px',
    maxWidth: 900
  },
  imgStyle: {
    maxWidth: 900
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
      {collections.map((collection_obj) => {
        const id = collection_obj[0];
        const collection = collection_obj[1];
        return (
          <Card style={styles.cardStyle} key={ id }>
            {/* <CardTitle
              title={ collection.name }
            /> */}
            <CardMedia
              overlay={<CardTitle
                title={collection.name}
                />}
            >
              <img src={collection.photo.replace("localhost:8000", "represent.me")}
              style={styles.imgStyle}/>

            </CardMedia>
            <CardText>
              { collection.desc }
            </CardText>
            <CardActions>
              <Link to={ "/survey/" + id }>
                <RaisedButton label="Start" primary />
              </Link>
            </CardActions>
          </Card>
        )
      })}
    </div>
  );
}))

export default CollectionsList;
