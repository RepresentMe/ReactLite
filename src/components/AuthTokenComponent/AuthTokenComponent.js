import React from 'react';
import { observer, inject } from "mobx-react";

const AuthTokenComponent = inject("UserStore")(observer((props) => {

  let code = props.match.params.code;

  window.API.post("/auth/onetime_signin/", {
    code
  }).then((response) => {
    console.log(response.data);
    if(response.data.access_token) {
      props.UserStore.setupAuthToken(response.data.access_token);
      props.history.push("/collection/" + decodeURIComponent(props.match.params.redirect));
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
