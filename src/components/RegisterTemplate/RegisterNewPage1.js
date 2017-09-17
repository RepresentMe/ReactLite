import React from 'react';
import FacebookLogin from 'react-facebook-login';

import TextField from 'material-ui/TextField';
import { cyan600 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
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
  floatingLabelText: {
    color: cyan600
  },
  facebookLoginStyle: {
    display: 'inline-block',
    width: '100%'
  },
  txtStyle: {
    color: cyan600
  }
}

const Page1 = (props) => {
  const displayMsgFB = () => {
    if (!props.agreedTermsValue) {
      props.displayMsgFB();
    }
  }

  return (
    <div style={{width: '100%', height: '100%'}}>

      <TextField //hintText="Cell phone number / email"
        floatingLabelText="Cell phone number / email"
        floatingLabelFocusStyle={styles.floatingLabelText}
        style={{width: '100%'}}
        value={props.email}
        onChange={(e, newValue) => props.handleInput('email', newValue)}
        /><br />
      <TextField //hintText="Password"
        floatingLabelText="Password"
        floatingLabelFocusStyle={styles.floatingLabelText}
        type="password"
        style={{width: '100%'}}
        value={props.password}
        errorText={!props.passwordValid}
        onChange={(e, newValue) => props.handleInput('password', newValue)}
        /><br />
      {!props.passwordMatched ? <TextField //hintText="Confirm password"
        floatingLabelText="Confirm password"
        floatingLabelFocusStyle={styles.floatingLabelText}
        type="password"
        style={{width: '100%'}}
        errorText={!props.passwordMatched}
        onChange={(e, newValue) => props.checkPasswordMatch(newValue)}
        /> :
        <p style={styles.txtStyle}>Password matches confirmation</p>}
        <br />

      <p style={{margin: '10px auto', color: cyan600, textAlign: 'center'}}>OR</p>

      <div>
        {props.agreedTermsValue ? <FacebookLogin
          cssClass="custom-facebook-login-button"
          appId={String(window.authSettings.facebookId)}
          version={2.6}
          autoLoad={false}
          fields="name,email,picture"
          callback={props.facebookCallback}
          style={styles.facebookLoginStyle}
          textButton="Sign in with Facebook"
          buttonStyle={{cursor: 'pointer'}}
          disableMobileRedirect={true}
          /> :
          <RaisedButton
            label={'sign in with facebook'}
            primary={true}
            onTouchTap={displayMsgFB}
            style={{width: '100%'}}
          />}
      </div>

      {/* <MessengerCheckboxPlugin
        appId={String(window.authSettings.facebookId)}
        pageId={String(window.authSettings.facebookPageId)}
        /> */}

      <Checkbox onCheck={props.agreedTerms}
          label='I agree with privacy policy'
          labelPosition='right'
          style={{margin: '10px 0px'}}
          labelStyle={{fontSize: '0.8rem', fontWeight: 'bold'}}
          value={props.agreedTermsValue}
          checked={props.agreedTermsValue}
          />
      <p style={{textAlign: 'center', fontSize: '12px'}}>
        By joining you agree to the <a href="https://represent.me/legal/terms/">terms and conditions</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a><br/>
      </p>

    </div>
  )
}

export default Page1;
