import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';

var CompareCollectionUsers = inject("CollectionStore")(observer(({ CollectionStore }) => {

  return <CompareCollectionUsersView />
})) 

const CompareCollectionUsersView = observer(({data})=> {
  return (<div style={{overflowX}} >
    {data.users.map((user) => {
      return (<UserCard style={{float: "left"}}/>)
    })}
  </div>)
})

const UserCard = observer(({data}) => {
  return (<div>
    <div>image</div>
    <div>name</div>
    <div>age</div>
  </div>)
})