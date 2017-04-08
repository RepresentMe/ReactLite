import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';

var CollectionsList = inject("CollectionStore")(observer(({ CollectionStore }) => {

  if(CollectionStore.collections.size <= 0) {
    return null;
  }

  let collections = CollectionStore.collections.entries();

  return (
    <div>
      <div><CollectionSearch /></div>
      {collections.map((collection_obj) => {
        let id = collection_obj[0];
        let collection = collection_obj[1];
        return (
          <Card style={{margin: '10px'}} key={ id }>
            <CardTitle
              title={ collection.name }
            />
            <CardText>
              { collection.desc }
            </CardText>
            <CardActions>
              <Link to={ "/survey/" + id }><RaisedButton label="Start" primary /></Link>
            </CardActions>
          </Card>
        )
      })}
    </div>
  );
}))

export default CollectionsList;
