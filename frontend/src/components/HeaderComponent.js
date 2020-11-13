import React, { useState, useEffect } from "react";
import "./HeaderComponent.css";
import ModalComponent from "./ModalComponent";
import { Link } from "react-router-dom";
import ButtonComponent from "./ButtonComponent";
import { Formik, Form, Field, ErrorMessage } from "formik";

const HeaderComponent = ({ headerText, toggleSignUpModal }) => {
  console.log("header", toggleSignUpModal);
  const localStorage = window.localStorage;
  // const authToken = localStorage.getItem('authToken');

  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));

  const [signUpModalVisible, setSignUpModalVisible] = useState(
    toggleSignUpModal
  );
  useEffect(() => {
    setSignUpModalVisible(toggleSignUpModal);
  }, [toggleSignUpModal]);

  const [loginModalVisible, setloginModalVisible] = useState(false);

  const [msg, setMsg] = useState("");

  const showSignUpModal = () => {
    setSignUpModalVisible(true);
  };
  const closeSignUpModal = () => {
    setSignUpModalVisible(false);
  };
  const showLoginModal = () => {
    setloginModalVisible(true);
  };
  const closeLoginModal = () => {
    setloginModalVisible(false);
  };

  function handleLogout() {
    localStorage.setItem("authToken", "");
    setAuthToken(localStorage.getItem("authToken"));
  }

  return (
    <div className="header-container" style={styles.headerContainer}>
      <div className="header-background-overlay-graphic"></div>
      <div className="navbar">
        <div className="icon-with-title">
          <img
            className="navbar-logo"
            src={require("../assets/images/logo.svg")}
            alt="nibbles logo"
          />
          <Link
            to={{
              pathname: "/"
            }}
            style={styles.noLinkTextDecoration}
          >
            <div className="navbar-title">Nibbles</div>
          </Link>
        </div>
        <div className="nav-items">
        </div>
        <div className="login-sign-up-buttons-container">
          {!authToken && (
            <>
            {/*
              <div className="login-button" onClick={showLoginModal}>
                Login
              </div> */}
              <div className="nav_login-button">
                <ButtonComponent buttonText="Log in" onClick={showLoginModal} />
              </div>
              <div className="nav_signup-button">
                <ButtonComponent buttonText="Sign up" onClick={showSignUpModal} />
              </div>
            </>
          )}
        </div>
        <div className="logged-in-buttons-container">
          {authToken && (
            <>
              <Link
                to={{
                  pathname: "/profile"
                }}
                style={styles.noLinkTextDecoration}
              >
                <ButtonComponent className="nav-items" buttonText="Profile"/>
              </Link>
              <Link
                to={{
                  pathname: "/saved-recipes"
                }}
                style={styles.noLinkTextDecoration}
              >
                <div className="nav-items">Saved Recipes</div>
              </Link>
              <div className="logout-button">
                <ButtonComponent buttonText="Logout" onClick={handleLogout} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="header-title-graphic-container">
        <div className="header-title">{headerText}</div>
        <div className="header-image-of-chef-wrapper">
          <img
            className="header-image-of-chef"
            alt="graphic of person cooking in the kitchen"
            src={require("../assets/images/woman-cooking.svg")}
          />
        </div>
      </div>
      {signUpModalVisible && (
        <ModalComponent enableCloseButton closeButtonCb={closeSignUpModal}>
          {/*  SIGN UP FORM */}
          <div className="sign-up-block">
            <h1 className="sign-up-heading">Sign up Form</h1>
            <p> Sign up to save recipes and have a personal profile! </p>
            <Formik
              initialValues={{ name: "", email: "", password: "" }}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Email is required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                if (!values.password) {
                  errors.password = "Password is required";
                }
                if (!values.name) {
                  errors.name = "Name is required";
                }
                return errors;
              }}
              // SUBMIT
              onSubmit={(values, { setSubmitting }) => {
                const response = fetch("http://127.0.0.1:5000/signup", {
                  method: "POST",
                  body: JSON.stringify(values),
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                  }
                })
                  .then(res => res.json())
                  .then(res => {
                    console.log(res.msg);
                    setMsg(res.msg);
                  });

                alert(msg);
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="form-display">
                  <label htmlFor="name" id="field-title">Name</label>
                  <div className="field-padding">
                    <Field
                      type="name"
                      name="name"
                      id="input-field"
                      placeholder="Enter name"
                      className={`form-control ${
                        touched.name && errors.name ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="name"
                      className="invalid-feedback"
                    />
                  </div>

                  <label htmlFor="email" id="field-title">Email</label>
                  <div className="field-padding">
                    <Field
                      type="email"
                      name="email"
                      id="input-field"
                      placeholder="Enter email"
                      className={`form-control ${
                        touched.email && errors.email ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                  </div>

                  <label htmlFor="password" id="field-title">Password</label>
                  <Field
                    type="password"
                    name="password"
                    id="input-field"
                    placeholder="Enter password"
                    className={`form-control ${
                      touched.password && errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="invalid-feedback"
                  />
                  <br />

                  <div className="signup-button-block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="signup-button"
                      backgroundcolor="#febd2e"
                    >
                      {isSubmitting ? "Please wait..." : "Sign Up"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </ModalComponent>
      )}
      {loginModalVisible && (
        <ModalComponent enableCloseButton closeButtonCb={closeLoginModal}>
          {/*  LOGIN FORM */}
          <div className="sign-up-block">
            <h1 className="sign-up-heading">Login</h1>
            <p> Log in to save recipes and view your profile! </p>
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={values => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Email is required";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }
                if (!values.password) {
                  errors.password = "Password is required";
                }
                return errors;
              }}
              // SUBMIT
              onSubmit={(values, { setSubmitting }) => {
                const response = fetch("http://127.0.0.1:5000/login", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Methods": "*"
                  },
                  body: JSON.stringify(values)
                })
                  .then(res => res.json())
                  .then(token => {
                    if (token.access_token) {
                      console.log(token);
                      localStorage.setItem("authToken", token.access_token);
                      localStorage.setItem("user", token.name);
                      setAuthToken(localStorage.getItem("authToken"));
                      closeLoginModal();
                    } else {
                      alert("Invalid Email or Password");
                    }
                  });
              }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form className="form-display">
                  <label htmlFor="email" id="field-title">Email</label>
                  <div className="field-padding">
                    <Field
                      type="email"
                      name="email"
                      id="input-field"
                      placeholder="Enter email"
                      className={`form-control ${
                        touched.email && errors.email ? "is-invalid" : ""
                      }`}
                    />
                    <ErrorMessage
                      component="div"
                      name="email"
                      className="invalid-feedback"
                    />
                  </div>

                  <label htmlFor="password" id="field-title">Password</label>
                  <Field
                    type="password"
                    name="password"
                    id="input-field"
                    placeholder="Enter password"
                    className={`form-control ${
                      touched.password && errors.password ? "is-invalid" : ""
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="password"
                    className="invalid-feedback"
                  />
                  <br />

                  <div className="signup-button-block">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="signup-button"
                      backgroundColor="#febd2e"
                    >
                      {isSubmitting ? "Please wait..." : "Log In"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </ModalComponent>
      )}
      )
    </div>
  );
};

const styles = {
  headerContainer: {
    backgroundImage: `url(${require("../assets/images/header-overlay.svg")})`
  },
  noLinkTextDecoration: {
    textDecoration: "none",
    color: "#4e4e4e"
  }
};
export default HeaderComponent;
