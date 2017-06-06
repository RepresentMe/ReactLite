import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { Link } from 'react-router-dom';

import Paper from 'material-ui/Paper';
import { grey100, cyan600, indigo500 } from 'material-ui/styles/colors';

import Checkbox from 'material-ui/Checkbox';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';

import smallLogo from './represent_white_outline.svg';

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
    display: 'inline-block',
    width: '100%',
    color: 'white',
    backgroundColor: indigo500
  },
  txtStyle: {
    color: cyan600
  },
  buttonsContainerStyle: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row nowrap',
    justifyContent: 'center'
  },
  imgStyleJoin: {
    minHeight: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    maxWidth: '30px',
    verticalAlign: 'middle',
    margin: 10,
    flex: 1
  }
}

const JoinGroupPage1 = (props) => {

  const attemptNextPage = () => {
    props.nextPage()
  }
  return (
    <div style={{width: '100%', height: '100%'}}>
      <Paper zDepth={0} className='containerStyle'>
        <div style={styles.buttonsContainerStyle}>
          <img src={props.groupLogo ? props.groupLogo : null} style={styles.imgStyleJoin} />
          <img src={smallLogo} style={styles.imgStyleJoin} />
        </div>
        <p style={{margin: '10px 0'}}>
          {`We're working with Represent to modernise democracy. `}
          <Link to="#" onTouchTap={() => props.toggleIntro()}><span style={{fontSize: 14}}>Learn more</span></Link>
        </p>

        <CheckboxComponent
          label={`Follow ${props.groupName} on Represent`}
          handleCheck={(e, value) => props.handleCheck(e, 'followGroup')}
          value='followingGroup'
          checked={props.followingGroup}
          />
        <CheckboxComponent
          label={`Share my email with ${props.groupName}`}
          handleCheck={(e, value) => props.handleCheck(e, 'shareEmail')}
          value='sharingEmail'
          checked={props.sharingEmail}
          />

        <FacebookLogin
          appId={String(window.authSettings.facebookId)}
          autoLoad={false}
          fields="name,email,picture"
          callback={props.facebookCallback}
          style={styles.facebookLoginStyle}
          textButton="login with Facebook"
          buttonStyle={{cursor: 'pointer', width: '100%', paddingBottom: 7, paddingTop: 5, textAlign: 'middle', margin: '10px auto'}}
          disableMobileRedirect={true}
          icon={<FacebookBox color='white' style={{verticalAlign: 'middle', marginRight: 10}}/>}
          />

          <p style={{fontSize: 12, marginTop: 5, marginBottom: 20}}>
            We'll never post without your permission
          </p>

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
        </Paper>
    </div>
)}

const CheckboxComponent = (props) => {
  const handleCheck = (e, value) =>{
    props.handleCheck(e, value)
  }
  return <div style={{display: 'inline-block'}}>
          <Checkbox onCheck={handleCheck}
              label={props.label}
              labelPosition='right'
              labelStyle={{fontSize: 14, width: '100%'}}
              value={props.value}
              checked={props.checked}
              />
        </div>
}

export default JoinGroupPage1;
