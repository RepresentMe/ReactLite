import React from 'react';


const AuthCode = (props) => {
  console.log(props.match.params.code);
  props.history.push("/" + decodeURIComponent(props.match.params.redirect));
  return (
    <p>Logging in...</p>
  );
}

export default AuthCode;
