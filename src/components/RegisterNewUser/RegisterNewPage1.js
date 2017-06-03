import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';

import TextField from 'material-ui/TextField';
import { grey200, cyan600, orange500, indigo500 } from 'material-ui/styles/colors';
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
    <div className="accountmgmt">
      <Paper zDepth={0} className='containerStyle'>
          <div style={{textAlign: 'center'}}>
      <img src="/static/media/represent_white_outline.dbff67a6.svg" className="introimage" />
      <h2 style={{margin: '10px 0'}}>
          A Revolution in Democracy  
        </h2>
        </div>
        <p>
          A more effective democracy is within reach. 
          Represent gives your views and values a voice. One central place to vote on the issues and work with the politicians and groups you trust to represent you.
        </p><p> 
          Represent is free, open to everyone, community-driven, anonymous and secure. 
        </p><p>
          By signing up you can track your MP, have your say, and make our combined voices more powerful and effective to create the world we want. 
          <Link to="#" onTouchTap={() => props.toggleIntro()}><span> Learn more</span></Link>
        </p>

        <Checkbox
            className="regForm"
            onCheck={() => props.agreedTerms()}
            labelStyle={{ zIndex: 3 }}
            label={
              <span>
                I agree to the <a href="https://represent.me/legal/terms/" target="_blank">terms</a> and <a  target="_blank" href="https://represent.me/legal/privacy-policy/">privacy policy</a><br/>
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
            // icon={<FacebookBox color='white' style={{verticalAlign: 'top', width: 16, height: 16, marginRight: 10 }}/>}

            /> :

            <RaisedButton
              label={<span className='fbMockButton'>login with facebook</span>}
              primary={true}
              onTouchTap={attemptNextPage}
              buttonStyle={{backgroundColor: '#5570A6'}}
              style={{width: '100%', color: '#eee'}}
              // icon={<FacebookBox color='#eee' style={{verticalAlign: 'middle', width: 16, height: 16}} />}
            />}
        </div>
        <p style={{fontSize: 12, marginTop: 5, marginBottom: 12, color: '#999', fontWeight: 300,}}>
          We'll never post without your permission
        </p>

        <p style={{color: orange500}}>{props.problem}</p>

        <div>
          <div className='button'
            onTouchTap={attemptNextPage}
            style={{backgroundColor: grey200, color: 'black',  border:'1px solid #ccc'}}
            >Create a Represent account
          </div>
          <div className='button'
            onTouchTap={props.redirectToLogin}
            style={{backgroundColor: grey200, color: 'black', border:'1px solid #ccc'}}
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
