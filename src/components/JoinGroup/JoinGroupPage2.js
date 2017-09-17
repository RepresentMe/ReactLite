import React from 'react';
import FacebookLogin from 'react-facebook-login';

import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import { grey100, cyan600, orange500, indigo500 } from 'material-ui/styles/colors';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';
import FacebookBox from 'material-ui-community-icons/icons/facebook-box';

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
    alignItems: 'middle'
  },
  imgStyleJoin: {
    height: '30px',
    verticalAlign: 'middle',
    margin: 10,
    flex: 1
  },
  errorStyle: {
    color: orange500
  },
  problemStyle: {
    color: orange500,
    fontSize: '0.8rem',
    fontStyle: 'italic',
    textDecoration: 'none'
  }
}

const JoinGroupPage2 = (props) => {

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

      <TextField
        floatingLabelText="First name"
        floatingLabelFocusStyle={styles.floatingLabelText}
        style={{flex: 1}}
        value={props.firstName}
        onChange={(e, newValue) => props.handleInput('firstName', newValue)}
        /><br />

      <TextField
        floatingLabelText="Last name"
        floatingLabelFocusStyle={styles.floatingLabelText}
        style={{flex: 1}}
        value={props.lastName}
        onChange={(e, newValue) => props.handleInput('lastName', newValue)}
        /><br />

      <TextField
        floatingLabelText="Email address"
        floatingLabelFocusStyle={styles.floatingLabelText}
        style={{width: '100%'}}
        value={props.email}
        onChange={(e, newValue) => props.handleInput('email', newValue)}
        // errorText={this.state.problems ? this.state.problems[0] : ''}
        // errorStyle={styles.errorStyle}
        /><br />

      <TextField
        floatingLabelText="Password"
        floatingLabelFocusStyle={styles.floatingLabelText}
        type="password"
        style={{width: '100%'}}
        value={props.password}
        // errorText={this.state.problems ? this.state.problems[1] : ''}
        // errorStyle={styles.errorStyle}
        onChange={(e, newValue) => props.handleInput('password', newValue)}
        />

      <TextField
        floatingLabelText="Postcode"
        floatingLabelFocusStyle={styles.floatingLabelText}
        style={{width: '100%'}}
        onChange={(e, newValue) => props.handleInput('postcode', newValue)}
        value={props.postcode}
        //errorText={!props.postcode && " "}
        />

      <TextField
        floatingLabelText="I'm joining because... (optional)"
        style={{width: '100%'}}
        floatingLabelFocusStyle={styles.floatingLabelText}
        onChange={(e, newValue) => props.handleInput('joinReason', newValue)}
        value={props.joinReason}
        //errorText={!props.postcode && " "}
        />
        <div>
          {props.problems.length > 0 && props.problems.map((p,i)=>
            <li style={styles.problemStyle} key={i}>{p}</li>)}
        </div>

      {props.agreedTermsValue ? <FacebookLogin
        appId={String(window.authSettings.facebookId)}
        version={2.6}
        autoLoad={false}
        fields="name,email,picture"
        callback={props.facebookCallback}
        style={styles.facebookLoginStyle}
        textButton="Share on Facebook"
        buttonStyle={{cursor: 'pointer', width: '100%', paddingBottom: 7, paddingTop: 5, textAlign: 'middle'}}
        disableMobileRedirect={true}
        icon={<FacebookBox color='white' style={{verticalAlign: 'middle', marginRight: 10}}/>}

        /> :

        <RaisedButton
          label={<span className='fbMockButton'>Share on Facebook</span>}
          primary={true}
          onTouchTap={attemptNextPage}
          buttonStyle={{backgroundColor: indigo500}}
          style={{width: '100%'}}
          icon={<FacebookBox color='lightgrey' />}
        />}

      {props.agreedTermsValue ? <RaisedButton
        label={<span className='fbMockButton' style={{color: 'white'}}>Join</span>}
        primary={true}
        onTouchTap={props.nextPage}
        buttonStyle={{backgroundColor: '#1B8AAE'}}
        style={{width: '100%', marginTop: 20}}
      /> :
      <RaisedButton
        label={<span className='fbMockButton' style={{color: 'grey'}}>Join</span>}
        primary={false}
        onTouchTap={attemptNextPage}
        buttonStyle={{backgroundColor: 'white'}}
        style={{width: '100%', marginTop: 20}}
      />}

      <Checkbox onCheck={props.agreedTerms}
          label={
            <span>
              By joining you agree to the <a href="https://represent.me/legal/terms/">terms and conditions</a> and <a href="https://represent.me/legal/privacy-policy/">privacy policy</a><br/>
            </span>
          }
          labelPosition='right'
          style={{margin: '20px 0px'}}
          labelStyle={{fontSize: '12px', fontWeight: 'bold', textAlign: 'left'}}
          value={props.agreedTermsValue}
          checked={props.agreedTermsValue}
          />
      </Paper>

      <Dialog open={props.emailExists}>
        <p style={{fontWeight: 'bold'}}>{"It looks like you're already signed up to Represent, please login to join this group."}</p>
        <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={props.redirectToLogin} />
      </Dialog>

      <Dialog open={props.joinComplete}>
        <p style={{fontWeight: 'bold'}}>{"You're a member of " + props.groupName}</p>
        <FlatButton label="Login" style={{width: '100%'}} backgroundColor={grey100} secondary onClick={props.redirectToLogin} />
      </Dialog>
    </div>

  )
}

export default JoinGroupPage2;
