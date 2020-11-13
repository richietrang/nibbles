import React, { useState, useEffect } from 'react';
import DefaultLayout from '../layouts/DefaultLayout';
import HeaderComponent from '../components/HeaderComponent';
import ButtonComponent from '../components/ButtonComponent';
import RecipeThumbnailComponent from "../components/RecipeThumbnailComponent";
import ModalComponent from "../components/ModalComponent";
import { Formik, Form, Field, ErrorMessage } from "formik";

import './ProfilePage.css';
import { Link } from 'react-router-dom';

const ProfilePage = () => {

  const styles = {
    noLinkTextDecoration: {
      textDecoration: 'none',
      color: '#4e4e4e',
    },
  };
  const localStorage = window.localStorage;
  const authToken = localStorage.getItem('authToken')
  const user = localStorage.getItem('user')

  const [pwModalVisible, setPwVisible] = useState(false);
  const [msg, setMsg] = useState("Password Changed");

  const showChangePwModal = () => {
    setPwVisible(true);
  };

  const closeChangePwModal = () => {
    setPwVisible(false);
  };

  const alertMessage = () => {
    alert(msg);
  };

  const settingsPicture = require("../assets/images/settings.png");


  return (
    <DefaultLayout>
      <HeaderComponent
        headerText="Your Profile"
      />
      <h1 className="category-title align-center">Welcome {user}</h1>

      <div className="change-password">
        <ButtonComponent buttonText="Change Password" backgroundColor="#febd2e" onClick={showChangePwModal}/>
      </div>

      {pwModalVisible && (
        <ModalComponent enableCloseButton closeButtonCb={closeChangePwModal}>
          {/*  CHANGE PW FORM */}
          <div>
            <h1>Change Password</h1>
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
                const response = fetch("http://127.0.0.1:5000/changepw", {
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

                alertMessage()
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
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="email"
                    className="invalid-feedback"
                  />
                  <br />
                  <br />

                  <label htmlFor="password">New Password</label>
                  <Field
                    type="password"
                    name="password"
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
                  <br />
                  <div className="pw-button">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      backgroundcolor="#febd2e"
                    >
                      {isSubmitting ? "Please wait..." : "Change Password"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </ModalComponent>
      )}

      <div className="saved-recipes-container">
        <p>Other settings to be added in the future!</p>
        <img className="no-saved-recipes-image" src={settingsPicture} alt="settings picture" />
      </div>


    </DefaultLayout>
  );
}

export default ProfilePage;
