import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';

var CollectionIntro = inject("CollectionStore", "UserStore")(observer(({ CollectionStore, UserStore, match }) => {

  let collectionId = parseInt(match.params.collectionId);
  let collection = CollectionStore.collections.get(collectionId);

  if(!collectionId) {
    return null;
  }

  if(!collection) {
    CollectionStore.getCollection(collectionId);
    return null;
  }

  if(!CollectionStore.collectionItems.has(collectionId)) {
    CollectionStore.items(collectionId); // Buffers the questions
  }

  return (
    <Card style={{margin: '10px'}}>
      <CardTitle
        title={ collection.name }
      />
      <CardText>
        { collection.desc }
      </CardText>
      <CardActions>
        <Link to={ "/collection/" + collection.id + "/flow/0" }><RaisedButton label="Start" primary /></Link>
        {UserStore.userData.has("id") && CollectionStore.collections.get(collectionId).user.id === UserStore.userData.get("id") && <Link to={ "/collection/" + collectionId + "/edit" }><RaisedButton label="Edit" primary /></Link>}
      </CardActions>
    </Card>
  );
}))

export default CollectionIntro;
