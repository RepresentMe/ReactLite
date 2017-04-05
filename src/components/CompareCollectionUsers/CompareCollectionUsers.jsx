import React, { Component } from 'react';
import { observer, inject } from "mobx-react";
import { Link } from 'react-router-dom';
import CollectionSearch from '../CollectionSearch';

import './style.css';

var CompareCollectionUsers = inject("CollectionStore")(observer(({ CollectionStore}) => {

  let viewData = {
    users: []
  }

  let userIds = [7, 4895];

  return <CompareCollectionUsersView data={viewData} />
})) 

const CompareCollectionUsersView = observer(({data})=> {
  return (<div style={{ border: "1px solid black" }} className="compare-collection-users">
    {data.users.map((user) => {
      return (<UserCard style={{float: "left"}}/>)
    })}
  </div>)
})

const UserCard = observer(({data}) => {
  return (<div className="user-card">
    <div>image</div>
    <div>name</div>
    <div>age</div>
  </div>)
})

export default CompareCollectionUsers;