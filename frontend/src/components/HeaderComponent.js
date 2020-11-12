import React, { useState } from 'react';
import './HeaderComponent.css';
import ModalComponent from './ModalComponent';
import { Link } from 'react-router-dom';
import ButtonComponent from './ButtonComponent';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const HeaderComponent = ({ headerText }) => {
  const [signUpModalVisible, setSignUpModalVisible] = useState(false);
  const [loginModalVisible, setloginModalVisible] = useState(false);

  const [msg, setMsg] = useState("initial message")

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
              pathname: '/saved-recipes',
            }}
            style={styles.noLinkTextDecoration}
          >
            <div className="nav-item">Saved Recipes</div>
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
        >
          {/*  SIGN UP FORM */}
          <div>
          <h1>Sign up Form</h1>
            <Formik
              initialValues={{ name: '', email: '', password: '' }}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = 'Email is required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }
                if (!values.password) {
                  errors.password = 'Password is required';
                }
                if (!values.name) {
                  errors.name = 'Name is required';
                }
                return errors;
              }}
              // SUBMIT
              onSubmit={(values, { setSubmitting }) => {
                const response = fetch('http://127.0.0.1:5000/signup', {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': '*',
                    'Access-Control-Allow-Methods': '*',
                  },
                  body: JSON.stringify(values),
                })
                  .then(res => res.json())
                  .then(token => {
                    if (token.access_token) {
                      console.log(token)
                    }
                    else {
                      alert("Invalid Email or Password")
                    }
              })
            }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <label htmlFor="name">Name</label>
                  <Field
                    type="name"
                    name="name"
                    placeholder="Enter name"
                    className={`form-control ${
                      touched.name && errors.name ? "is-invalid" : ""
                    }`} />
                  <ErrorMessage
                    component="div"
                    name="name"
                    className="invalid-feedback"/>
                  <br/>
                  <br/>

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
                  <br/>
                  <br/>
                  <div className="signup-button">
                    <button type="submit" disabled={isSubmitting} backgroundColor='#febd2e'>
                      {isSubmitting ? "Please wait..." : "Sign Up"}
                    </button>
                  </div>
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
              if (!values.password) {
                errors.password = 'Password is required';
              }
              return errors;
            }}
            // SUBMIT
            onSubmit={(values, { setSubmitting }) => {
              const response = fetch('http://127.0.0.1:5000/login', {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*',
                  'Access-Control-Allow-Headers': '*',
                  'Access-Control-Allow-Methods': '*',
                },
              })
                .then(res => res.json())
                .then(res => {console.log(res.msg); setMsg(res.msg)})

              alert(msg)
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
                <br/>
                <br/>

                <div className = "login-button">
                  <button type="submit" disabled={isSubmitting} backgroundColor='#febd2e'>
                    {isSubmitting ? "Please wait..." : "Log In"}
                  </button>
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
