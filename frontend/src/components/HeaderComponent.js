import React, { useState } from 'react';
import './HeaderComponent.css';
import ModalComponent from './ModalComponent';
import { Link } from 'react-router-dom';
import ButtonComponent from './ButtonComponent';

const HeaderComponent = ({ headerText }) => {
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [loginModalVisible, setloginModalVisible] = useState(false);

  const showSignUpModal = () => {
    setSignUpModalVisible(true);
  }
  const closeSignUpModal = () => {
    setSignUpModalVisible(false);
  }
  const showLoginModal = () => {
    setloginModalVisible(true);
  }
  const closeLoginModal = () => {
    setloginModalVisible(false);
  }

  return (
    <div className="header-container" style={styles.headerContainer}>
      <div className="header-background-overlay-graphic"></div>
      <div className="navbar">
        <div className="icon-with-title">
          <img className="navbar-logo" src={require('../assets/images/logo.svg')} alt="nibbles logo" />
          <Link
            to={{
              pathname: '/',
            }}
            style={styles.noLinkTextDecoration}
          >
            <div className="navbar-title">Nibbles</div>
          </Link>
        </div>
        <div className="nav-items">
          <Link
            to={{
              pathname: '/how-nibbles-works',
            }}
            style={styles.noLinkTextDecoration}
          >
            <div className="nav-item">how it works</div>
          </Link>
        </div>
        <div className="login-sign-up-buttons-container">
          <div className="login-button" onClick={showLoginModal}>Login</div>
          <ButtonComponent buttonText="Sign up" onClick={showSignUpModal} />
        </div>
      </div>
      <div className="header-title-graphic-container">
        <div className="header-title">{headerText}</div>
        <div className="header-image-of-chef-wrapper">
          <img className="header-image-of-chef" alt="graphic of person cooking in the kitchen" src={require('../assets/images/woman-cooking.svg')} />
        </div>
      </div>
      { signUpModalVisible &&
        <ModalComponent
          enableCloseButton
          closeButtonCb={closeSignUpModal}
          alternateButtonText="Sign Up"
        >
          <div>Hello world!!! This is some sign up content babyeee</div>
        </ModalComponent>
      }

      { loginModalVisible &&
        <ModalComponent
          enableCloseButton
          closeButtonCb={closeLoginModal}
          alternateButtonText="Log In"
        >
          <div>Hello world!!! This is some Login content babyeee</div>
        </ModalComponent>
      }
    </div>
  );
}

const styles = {
  headerContainer: {
    backgroundImage: `url(${require('../assets/images/header-overlay.svg')})`,
  },
  noLinkTextDecoration: {
    textDecoration: 'none',
    color: '#4e4e4e',
  },
}
export default HeaderComponent;
