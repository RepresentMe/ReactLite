import React from 'react';
import { observer, inject } from "mobx-react";

const AuthTokenComponent = inject("UserStore")(observer((props) => {

  let authtoken = props.match.params.authtoken;

  props.UserStore.setupAuthToken(authtoken)
    .then((response) => {
      if(response.data.access_token) {
        props.UserStore.setupAuthToken(response.data.access_token);
        props.history.push("/" + decodeURIComponent(props.match.params.redirect));
      }else {
        props.history.push("/login/" + props.match.params.redirect);
      }
    }).catch((error) => {
      props.history.push("/login/" + props.match.params.redirect);
    })

  return (
    <p>Logging in...</p>
  );
}));


export default AuthTokenComponent;
