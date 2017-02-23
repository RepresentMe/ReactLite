import React, { Component } from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';

var CollectionEnd = inject("CollectionStore", "QuestionStore")(observer(({ CollectionStore, QuestionStore, match }) => {

  let collectionId = parseInt(match.params.collectionId);
  let collection = CollectionStore.collections.get(collectionId);

  if(!collection) {
    return null;
  }

  // Buffer the questions
  QuestionStore.loadCollectionQuestions(collectionId);

  return (
    <Card style={{margin: '10px'}}>
      <CardTitle
        title={ collection.name }
        subtitle="You've just completed"
      />
      <CardText>
        { collection.desc }
      </CardText>
    </Card>
  );
}))

export default CollectionEnd;
