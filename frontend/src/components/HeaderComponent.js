import React, { useState } from 'react';
import './HeaderComponent.css';
import ModalComponent from './ModalComponent';
import { Link } from 'react-router-dom';
import ButtonComponent from './ButtonComponent';
import { Formik, Form, Field, ErrorMessage } from 'formik';

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
          {/*  SIGN UP FORM */}
          <div>
          <h1>Sign up Form</h1>
            <Formik
              initialValues={{ email: '', password: '' }}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = 'Email is required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  alert(JSON.stringify(values, null, 2));
                  setSubmitting(false);
                }, 400);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <label htmlFor="email">Email</label>
                  <Field
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    className={`form-control ${
  									  touched.email && errors.email ? "is-invalid" : ""
  									}`} />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="invalid-feedback"/>
                  <br/>
                  <label htmlFor="password">Password</label>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      className={`form-control ${
                        touched.password && errors.password ? "is-invalid" : ""
                      }`} />
                    <ErrorMessage
                      component="div"
                      name="password"
                      className="invalid-feedback"/>
                  <ButtonComponent type="submit" buttonText="Sign Up" disabled={isSubmitting} backgroundColor='#febd2e'>
                    {isSubmitting ? "Please wait..." : "Run"}
                  </ButtonComponent>
                </Form>
              )}
            </Formik>
          </div>
        </ModalComponent>
      }

      { loginModalVisible &&
        <ModalComponent
          enableCloseButton
          closeButtonCb={closeLoginModal}
          alternateButtonText="Log In"
        >
        {/*  LOGIN FORM */}
        <div>
        <h1>Login</h1>
          <Formik
            initialValues={{ email: '', password: '' }}
            validate={values => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Email is required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ touched, errors, isSubmitting }) => (
              <Form>
                <label htmlFor="email">Email</label>
                <Field
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className={`form-control ${
                    touched.email && errors.email ? "is-invalid" : ""
                  }`} />
                <ErrorMessage
                  component="div"
                  name="email"
                  className="invalid-feedback"/>
                <br/>
                <label htmlFor="password">Password</label>
                  <Field
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    className={`form-control ${
                      touched.password && errors.password ? "is-invalid" : ""
                    }`} />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="invalid-feedback"/>
                <div className = "login-button">
                  <ButtonComponent type="submit" buttonText="Log In" disabled={isSubmitting} backgroundColor='#febd2e'>
                    {isSubmitting ? "Please wait..." : "Run"}
                  </ButtonComponent>
                </div>
              </Form>
            )}
          </Formik>
        </div>
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
