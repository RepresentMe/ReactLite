import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import { grey100, cyan600, orange500, indigo500 } from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
//import Dialog from 'material-ui/Dialog';
//import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

//import MessengerCheckboxPlugin from '../MessengerCheckboxPlugin';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';
import smallLogo from './represent_white_outline.svg';
import './RegisterNewUser.css';

const styles = {
  containerStyle: {
    padding: '10px 20px',
    maxWidth: 420,
    minWidth: 270,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  floatingLabelText: {
    color: cyan600
  },
  facebookLoginStyle: {
    // display: 'inline-block',
    width: '100%',
    color: 'white',
    backgroundColor: indigo500
  },
  txtStyle: {
    color: cyan600
  }
}

const Page1 = (props) => {

  const attemptNextPage = () => {
    if (!props.agreedTermsValue) {
      props.displayProblem();
    }
    else {
      props.nextPage()
    }
  }
  return (
    <div style={{width: '100%', height: '100%'}}>
      <Paper zDepth={0} className='containerStyle'>
          <div style={{textAlign: 'center'}}>
      <img src="/static/media/represent_white_outline.dbff67a6.svg" className="introimage" />
      <h2 style={{margin: '10px 0'}}>
          A better democracy
        </h2>
        </div>
        <p style={{}}>
          Vote on important issues, tell your MP, and track how well they represent you.
          <Link to="#" onTouchTap={() => props.toggleIntro()}><span> Learn more</span></Link>
        </p>

        <Checkbox onCheck={() => props.agreedTerms()}
            label={
              <span>
                I agree to the <a href="https://represent.me/legal/terms/">terms</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a><br/>
              </span>
            }
            labelPosition='right'

            value={props.agreedTermsValue}
            checked={props.agreedTermsValue}
            />

        <div>
          {props.agreedTermsValue ? <FacebookLogin
            appId={String(window.authSettings.facebookId)}
            autoLoad={false}
            fields="name,email,picture"
            callback={props.facebookCallback}
            style={styles.facebookLoginStyle}
            textButton="login with Facebook"
            buttonStyle={{cursor: 'pointer', width: '100%', paddingBottom: 6, paddingTop: 9, textAlign: 'middle'}}
            disableMobileRedirect={true}
            icon={<FacebookBox color='white' style={{verticalAlign: 'top', width: 16, height: 16, marginRight: 10 }}/>}

            /> :

            <RaisedButton
              label={<span className='fbMockButton'>login with facebook</span>}
              primary={true}
              onTouchTap={attemptNextPage}
              buttonStyle={{backgroundColor: '#5570A6'}}
              style={{width: '100%', color: '#eee'}}
              icon={<FacebookBox color='#eee' style={{verticalAlign: 'middle', width: 16, height: 16}} />}
            />}
        </div>
        <p style={{fontSize: 12, marginTop: 10, marginBottom: 20, color: '#999'}}>
          We'll never post without your permission
        </p>

        <p style={{color: orange500}}>{props.problem}</p>

        <div>
          <div className='button'
            onTouchTap={attemptNextPage}
            style={{backgroundColor: grey100, color: 'black'}}
            >Create an account
          </div>
          <div className='button'
            onTouchTap={props.redirectToLogin}
            style={{backgroundColor: grey100, color: 'black'}}
            >Already have an account? Login
          </div>
        </div>

        <p style={{textAlign: 'center', fontSize: '12px', cursor: 'pointer'}}>
          <a href='https://app.represent.me/access/forgot-password/'>
            Forgotten your password?
          </a>
        </p>

      </Paper>
    </div>

  )
}

export default Page1;
