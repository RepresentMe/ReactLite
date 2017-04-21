import React, { Component } from 'react';

import { NavLink } from 'react-router-dom';
import './nav.css';

const styles = {
  navItemsStyle: {
    display: 'inline-block',
    margin: '10px'
  },
  navLinksStyle: {
    width: '100%'
  }
};


const Links = (props) => (
    <nav style={styles.navLinksStyle}>
      <NavLink exact activeClassName='active' to='/' style={styles.navItemsStyle}>Home</NavLink>
      <NavLink activeClassName='active' to='/test' style={styles.navItemsStyle}>Test</NavLink>
      <NavLink activeClassName='active' to='/charts/pie/collection/1' style={styles.navItemsStyle}>Collection</NavLink>
      <NavLink activeClassName='active' to='/charts/pie/question/1' style={styles.navItemsStyle}>Question</NavLink>
    </nav>
  )

export default Links;
