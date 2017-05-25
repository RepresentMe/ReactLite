import React, { Component } from 'react';
import { Switch } from 'react-router';
import { inject, observer, toJS } from "mobx-react";
import { observable } from 'mobx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Scrollbars } from 'react-custom-scrollbars';
// import DevTools from 'mobx-react-devtools';
import { MatchMediaProvider } from 'mobx-react-matchmedia';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import Face from 'material-ui/svg-icons/action/face';
import Avatar from 'material-ui/Avatar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { white, cyan600, black, grey700 } from 'material-ui/styles/colors';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';

import CollectionsList from '../CollectionsList';
import CollectionIntro from '../CollectionIntro';
import CollectionEnd from '../CollectionEnd';

import EndScreen from '../EndScreen';

import EditCollection from '../EditCollection';
import SurveyFlow from '../SurveyFlow';
import CreateCollection from '../CreateCollection';
import Login from '../Login';
import JoinGroup from '../JoinGroup';
import Join from '../Join';
import Test from '../Test';
import UndividedRender from '../UndividedRender';
import AuthCode from '../AuthCode';
import QuestionLiquidDisplay from '../charts/QuestionLiquidPiechart/QuestionLiquidDisplay';
import CollectionCharts from '../charts/CollectionCharts';
import DynamicConfigService from '../../services/DynamicConfigService';
import DynamicConfigEditor from '../DynamicConfigEditor';

import RegisterNewUser from '../RegisterNewUser';
import RegisterPage from '../RegisterNewUser/RegisterNewPage2';

import CandidateIntro from '../CandidateIntro';
import CandidateNew from '../CandidateNew';
import IntroCarousel from '../IntroCarousel';

import smallLogo from './represent_white_outline.svg';

// import CompareUsers from '../CompareUsersComponent';
import CompareUsers from '../EndScreen/partials/CompareUsersComponent';
// import CompareUsersDetails from '../CompareUsersComponent/CompareUsersDetailsComponent';
import CompareUsersDetails from '../EndScreen/partials/CompareUsersDetailsComponent';

import AuthTokenComponent from '../AuthTokenComponent'


import Drawer from 'material-ui/Drawer'; 




import RemoveRedEye from 'material-ui/svg-icons/image/remove-red-eye';
import Everyone from 'material-ui/svg-icons/places/all-inclusive';
import Share from 'material-ui/svg-icons/social/share';
import Important from 'material-ui/svg-icons/action/thumbs-up-down';
import Party from 'material-ui/svg-icons/social/group';
import Close from 'material-ui/svg-icons/navigation/close';


import './Shell.css';

import {
  Router,
  Route,
} from 'react-router-dom'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: white,
    alternateTextColor: '#1B8AAE',
  },
  slider: {
    selectionColor: '#1B8AAE',
    rippleColor: cyan600,
  },
  raisedButton: {
    textColor: white,
  },
  flatButton: {
    primaryTextColor: cyan600,
    secondaryTextColor: grey700,
  },
  datePicker: {
    textColor: white,
    color: cyan600,
    selectTextColor: white
  },
  checkbox: {
    checkedColor: cyan600
  }
});

const styles = {
  avatarStyle: {
    height: '16px',
    width: '16px',
    margin: '3px 0px'
  },
  leftIconStyle: {
    height: '20px'
  },
  pageWraperStyle: {
    height: '100%',
    position: 'absolute',
    width: '100%',
    top: 0,
    left: 0,
    overflow: 'hidden'
  },
  appBarStyles: {
    style: {
      height: '24px',
      padding: 0,
    },
    iconStyleLeft: {
      margin: '2px 4px'
    },
    iconStyleRight: {
      marginRight: '8px',
      marginTop: '0',
    },
    titleStyle: {
      margin: 0,
      lineHeight: '24px',
      fontSize: '16px',
      height: '24px',
      textAlign: 'center'
    }
  }
}



@inject("UserStore",  "QuestionStore") 
@observer
export default class Shell extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalOpened: false,
      open: false
    };
    this.dynamicConfig = DynamicConfigService;
    this.onLogout = this.onLogout.bind(this)
    this.navigateToLogin = this.navigateToLogin.bind(this)

    this.breakpoints = observable({
      sm: '(max-width: 900px)',
      lg: '(min-width: 901px)',
    });
  
  }

  onLogout() {
    this.props.UserStore.logout()
  }

  navigateToLogin() {
    this.props.history.push('/login/' + this.dynamicConfig.getNextConfigWithRedirect(this.props.history.location.pathname))
  }

  toggleIntro = () => {
    //e.preventDefault()
    const modalOpened = !this.state.modalOpened;
    this.setState({modalOpened})
  }



  handleToggle = () => this.setState({open: !this.state.open});


  render() {
    const raw_config = this.dynamicConfig.getDynamicConfig(this.props.history.location.pathname);
    if(raw_config) {
      this.dynamicConfig.setConfigFromRaw(raw_config)
    }

    let split_pathname = this.props.history.location.pathname.split("/");

    let mainContentStyle = {
      height: "calc(100% - 28px)",
      position: "relative"
    }

    if(split_pathname[1] === 'joingroup' || split_pathname[1] === 'undividedrender') {
      mainContentStyle.height = "100%";
    }

    const {
      avatarStyle,
      leftIconStyle,
      pageWraperStyle,
      appBarStyles: { style, iconStyleLeft, iconStyleRight, titleStyle }
    } = styles

    const { userData } = this.props.UserStore
    const userId = userData.get('id')
    const username = userData.get('username')
    const photo = userData.get('photo')

    const isAuthenticated = !!userData.get('id')

    const avatar = (
      <Avatar style={avatarStyle}
        icon={!this.props.UserStore.userData.has("id") ? <Face /> : null}
        src={this.props.UserStore.userData.has("photo") ? photo.replace("localhost:8000", "represent.me") : null}
        backgroundColor={cyan600}
        onClick={!isAuthenticated ? this.navigateToLogin : null}
      />
    )

    return(
      <Router history={this.props.history}>
          <MuiThemeProvider muiTheme={muiTheme}>
            <MatchMediaProvider breakpoints={this.breakpoints}>
              <div style={pageWraperStyle}>
                <div style={mainContentStyle}>

                  {split_pathname[1] !== 'joingroup' &&
                    <div>
                      <AppBar
                        iconElementLeft={
                            <img  src={smallLogo}
                                  style={leftIconStyle}
                                  onTouchTap={this.handleToggle}
                            />
                        }
                        iconElementRight={
                          <span>
                            { isAuthenticated ? (
                                <IconMenu
                                  iconButtonElement={
                                    avatar
                                  }
                                  anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                                  targetOrigin={{horizontal: 'right', vertical: 'bottom'}}
                                >
                                  <MenuItem primaryText="Edit profile" href="https://app.represent.me/me/edit/main/"/>
                                  <MenuItem primaryText="View my profile" href={`https://app.represent.me/profile/${userId}/${username}/`}/>
                                  <Divider />
                                  <MenuItem primaryText="Logout" onClick={this.onLogout}/>
                                </IconMenu> ) : (
                                  avatar
                                )
                          }
                          </span>
                        }
                        style={style}
                        iconStyleLeft={iconStyleLeft}
                        iconStyleRight={iconStyleRight}
                        titleStyle={titleStyle}
                        />
                    </div>
                  }

                  <div>
                    <Drawer 
                      open={this.state.open || this.breakpoints.lg}
                      docked={this.breakpoints.lg}
                    >
                      <Menu style={{color: '#222'}}>
                      <MenuItem primaryText="Close" leftIcon={<Close />} onTouchTap={this.handleToggle} />
                      <MenuItem primaryText="Tour" leftIcon={<RemoveRedEye />} onTouchTap={() => this.toggleIntro()} />
                      <MenuItem primaryText="Share" leftIcon={<Share />} />
                      <Divider />
                      <MenuItem primaryText="What's important to you" leftIcon={<Important />}  href="/survey/47" />
                      <Divider />
                      <Subheader>PARTY MANIFESTOS</Subheader>
                      <MenuItem primaryText="All in one" leftIcon={<Everyone />}  href="/survey/47" />
                      <MenuItem primaryText="Conservatives" leftIcon={<Party />}  href="/survey/119" />
                      <MenuItem primaryText="Green Party (E&W)" leftIcon={<Party />} href="/survey/121" />
                      <MenuItem primaryText="Labour" leftIcon={<Party />} href="/survey/50" />
                      <MenuItem primaryText="Liberal democrats" leftIcon={<Party />} href="/survey/116" />
                      <MenuItem primaryText="Plaid Cymru" leftIcon={<Party />} href="/survey/112" />
                      <MenuItem primaryText="Women's Equality Party" leftIcon={<Party />} href="/survey/118" />
                      <Divider />
                      <Subheader>TOPICS</Subheader>
                      <MenuItem primaryText="Coming soon" disabled={true} />
                      </Menu>
                    </Drawer>
                  </div>

                  <IntroCarousel
                    modalOpened={this.state.modalOpened}
                    toggleIntro={this.toggleIntro}/>

                  <Scrollbars autoHide>
                    <ReactCSSTransitionGroup
                      transitionName="QuestionFlowTransition"
                      transitionEnterTimeout={1000}
                      transitionLeaveTimeout={1000}>
                      {/*}<Links/>*/}
                      <Switch>
                        <Route exact path="/candidate" component={CandidateIntro}/>
                        <Route exact path="/candidate/new/:email" component={CandidateNew}/>
                        <Route exact path="/login/:dynamicConfig?" component={RegisterNewUser}/>
                        <Route exact path="/authcode/:code/:email/:redirect" component={AuthCode}/>
                        <Route exact path="/login/:dynamicConfig/:email" component={RegisterNewUser}/>
                        <Route exact path="/loginuser/:dynamicConfig" component={Login}/>
                        <Route exact path="/loginuser/:dynamicConfig/:email" component={Login}/>
                        <Route exact path="/register" component={RegisterPage}/>
                        <Route exact path="/register/:redirect" component={RegisterPage}/>
                        <Route exact path="/join/:dynamicConfig?" component={Join}/>
                        <Route exact path="/joingroup/:groupId" component={JoinGroup}/>
                        <Route exact path="/joingroup/:groupId/:redirect" component={JoinGroup}/>
                        <Route exact path="/survey/create" component={CreateCollection}/>
                        <Route exact path="/survey/:collectionId/:dynamicConfig?" component={CollectionIntro}/>
                        <Route exact path="/edit/:collectionId" component={EditCollection}/>
                        <Route exact path="/survey/:surveyId/flow/:itemNumber/:activeTab/:dynamicConfig?" component={SurveyFlow}/>
                        <Route exact path="/survey/:collectionId/end/:dynamicConfig?" component={CollectionEnd}/>
                        <Route exact path="/survey/:collectionId/end2/:dynamicConfig?" component={EndScreen}/>
                        <Route exact path="/test" component={Test}/>
                        <Route exact path="/undividedrender/:questionId" component={UndividedRender}/>
                        <Route exact path='/charts/pie/question/:questionId' component={QuestionLiquidDisplay}/>
                        <Route exact path='/charts/pie/collection/:collectionId' component={CollectionCharts}/>
                        <Route exact path='/authtoken/:authtoken/:dynamicConfig' component={AuthTokenComponent}/>
                        {/* <Route exact path="/:dynamicConfig?" component={CollectionsList}/> */}
                        <Route exact path='/compare' component={CompareUsers}/>
                        <Route exact path='/compare/:userId' component={CompareUsersDetails}/>
                        <Route exact path="/builder" component={DynamicConfigEditor}/>
                        <Route exact path="/:dynamicConfig?" component={CollectionsList}/>
                      </Switch>
                    </ReactCSSTransitionGroup>
                  </Scrollbars>
                </div>
                {/*<DevTools />*/}
                </div>
            </MatchMediaProvider>
          </MuiThemeProvider>
      </Router>

    )
  }

};
