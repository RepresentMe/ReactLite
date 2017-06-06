import React from 'react';

import RaisedButton from 'material-ui/RaisedButton';

import './RegisterNew.css';

const styles = {
  containerStyle: {
    padding: '10px 20px',
    maxWidth: '320px',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  imgStyle: {
    height: '30px',
    verticalAlign: 'middle',
    marginRight: '10px',
    marginTop: '-4px'
  },
  txtStyle: {
    fontWeight: 'bold'
  }
}

const Page3 = (props) => {

  return (
    <div style={{width: '100%', height: '100%'}}>
      <p style={styles.txtStyle}>
        Sign up was successful, welcome to Represent!
      </p>
      <RaisedButton
        label="Explore!"
        primary={true}
        style={{flex: 1, width: '100%'}}
        onTouchTap={props.attemptLogin}
      />
    </div>
  )
}

export default Page3;
