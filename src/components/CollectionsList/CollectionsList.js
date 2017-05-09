import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';

const styles = {
  cardStyle: {
    margin: '10px',
    maxWidth: 400,
    cssFloat: 'left',
    styleFloat: 'left',
  },
  imgStyle: {
    maxWidth: 400
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
          <Link to={ "/survey/" + id }>
          <Card style={styles.cardStyle} key={ id }>
            {/* <CardTitle
              title={ collection.name }
            /> */}
            <CardHeader
              title="URL Avatar"
              subtitle="Subtitle"
              avatar="images/jsa-128.jpg"
            />
            <CardMedia>
              <img src={collection.photo.replace("localhost:8000", "represent.me")}
              style={styles.imgStyle}/>
            </CardMedia>
            <CardTitle 
                title={collection.name}  />
            <CardText> 
              { collection.desc }
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
  );
}))

export default CollectionsList;
