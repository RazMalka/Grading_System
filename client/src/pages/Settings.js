import React, { useState } from "react";
import { getCookie, setCookie } from "../utilities/Cookies";
import { POST } from "../utilities/Requests";
import { faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { Col, Row, Button } from '@themesberg/react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const currentEmail = getCookie('email');
const currentPhone = getCookie('phone');

function ValidateEmail(inputText) {
    /* eslint-disable */
    var mailformat = /^(?:[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&amp;'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    /* eslint-enable */
    if (inputText.toLowerCase().match(mailformat)){
        return true;
    }
    else{
        alert("Invalid Email Address!");
        return false;
    }
}

function ValidatePhone(inputText) {
    var phoneFormat = /^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/;
        if (inputText.toLowerCase().match(phoneFormat)){
        return true;
    }
    else{
        alert("Invalid Phone Number!");
        return false;
    }
}

function ValidatePassword(inputText) {
    var passwordFormat = /^[a-zA-Z0-9_.-]*$/;
    if (inputText.toLowerCase().match(passwordFormat) && inputText.length >= 4 && inputText.length <= 16){
        return true;
    }
    else{
        alert("Invalid New Password!");
        return false;
    }
}

function redirect_logged_out() {
  if (getCookie('username') === '' || getCookie('status') === '') {
    window.location.href = "/";
  }
};

function App() {
  const [state, setState] = useState({ email: "", phone: "", currentPwd: "", newPwd: "" });
  const handleSubmitInfo = e => {
      e.preventDefault();
      UpdateInfo();
  };
  const handleSubmitPassword = e => {
    e.preventDefault();
    UpdatePassword();
};
  const handleChange = e => {
      setState({
          ...state,
          [e.target.name]: e.target.value
      });
  };

  const UpdatePassword = async () => {
    try {
        if (ValidatePassword(state['newPwd'])) {
            await POST({username: getCookie('username'), currentPwd: state['currentPwd'], newPwd: state['newPwd']}, 'settings/updatePassword');
            alert('Password Updated!');
        }
    }
    catch (error) {
        alert("Wrong Password!");
    }
    window.location.reload();
  };

  const UpdateInfo = async () => {
      try {
          let valid = true;
          if (state['email'] !== '') {
            valid = valid && ValidateEmail(state['email']);
          }
          if (state['phone'] !== '') {
              valid = valid && ValidatePhone(state['phone']);
          }
          if (valid) {
          let k = await POST({username: getCookie('username'), email: state['email'].toLowerCase(), phone: state['phone']}, 'settings/updateInfo');
          setCookie('phone', k.phone, 1);
          setCookie('email', k.email, 1);
          alert('Info Updated!');
          }
      }
      catch (error) {
          alert("Info Update Failed!");
      }
      window.location.reload();
  };

  function InfoForm() {
      return <>
      <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                              <center>
                                  <h4>Update Info</h4>
                                  <form onSubmit={handleSubmitInfo}>
                                      <FontAwesomeIcon icon={faEnvelope} />
                                      <br />
                                      <input
                                          name="email"
                                          type="text"
                                          placeholder={currentEmail}
                                          onChange={handleChange}
                                          className="userInput mb-4 w-75 text-center"
                                      />
                                      <br />
                                      <FontAwesomeIcon icon={faUnlockAlt} />
                                      <br />
                                      <input
                                          name="phone"
                                          type="text"
                                          placeholder={currentPhone}
                                          onChange={handleChange}
                                          className="userInput mb-4 w-75 text-center"
                                      />
                                      <br />
                                      <Button variant="primary" type="submit" className="userSubmit w-75">
                                          Update Settings
                                      </Button>
                                      <br/><br/><p style={{color: 'transparent'}}>Password has to include between 4 and 16 characters as a-z, A-Z, 0-9, _, -, .</p>
                                  </form>
                              </center>
                          </div>
      </>
  }

  function PasswordForm() {
      return <>
      <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                              <center>
                              <h4>Update Password</h4>
                                  <form onSubmit={handleSubmitPassword}>
                                      <FontAwesomeIcon icon={faEnvelope} />
                                      <br />
                                      <input
                                          name="currentPwd"
                                          type="password"
                                          placeholder="Current Password"
                                          onChange={handleChange}
                                          className="userInput mb-4 w-75 text-center"
                                      />
                                      <br />
                                      <FontAwesomeIcon icon={faUnlockAlt} />
                                      <br />
                                      <input
                                          name="newPwd"
                                          type="password"
                                          placeholder="New Password"
                                          onChange={handleChange}
                                          className="userInput mb-4 w-75 text-center"
                                      />
                                      <br />
                                      <Button variant="primary" type="submit" className="userSubmit w-75">
                                          Update Password
                                      </Button>
                                      <br/><br/><p>Password has to include between 4 and 16 characters as a-z, A-Z, 0-9, _, -, .</p>
                                  </form>
                              </center>
                          </div>
      </>
  }

  return (
      <div className="App">
          <br/><br/>
                {redirect_logged_out()}
                  <Row className="justify-content-center">
                      <Col xs={12} sm={6} xl={4} className="mb-4">
                          {InfoForm()}
                      </Col>
                      <Col xs={12} sm={6} xl={4} className="mb-4">
                          {PasswordForm()}
                      </Col>
                  </Row>
      </div>
  );
}
export default App;