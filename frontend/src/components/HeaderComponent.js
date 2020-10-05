import React from 'react';
import './HeaderComponent.css'

import WhiteButton from '../components/WhiteButton';

const HeaderComponent = () => {
  return (
    <div className="header-container" style={styles.headerContainer}>
      <div className="header-background-overlay-graphic"></div>
      <div className="navbar">
        <div className="icon-with-title">
          <img className="navbar-logo" src={require('../assets/images/logo.svg')} alt="nibbles logo" />
          <div className="navbar-title">Nibbles</div>
        </div>
        <div className="nav-items">
          <div className="nav-item">how it works</div>
        </div>
        <div className="login-sign-up-buttons-container">
          <div className="login-button">Login</div>
          <WhiteButton buttonText="Sign up" />
        </div>
      </div>

      <div className="header-title-graphic-container">
        <div className="header-title">Turn your leftovers into lunchtime magic!</div>
        <div className="header-image-of-chef-wrapper">
          <img className="header-image-of-chef" alt="graphic of person cooking in the kitchen" src={require('../assets/images/woman-cooking.svg')} />
        </div>
      </div>
    </div>

  );
}

const styles = {
  headerContainer: {
    backgroundImage: `url(${require('../assets/images/header-overlay.svg')})`,

  }
}
export default HeaderComponent;
