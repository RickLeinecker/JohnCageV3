import React, { useState } from "react";
import "../Style/resetPass.css";
import ResetPassword from "../API/resetPasswordAPI";
const ResetPass = () => {
  const [email, setEmail] = React.useState("");
  const [successfullLogin, setsuccessfullLogin] = useState(false);

  const handleChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setEmail(e.target.value);
    console.log("email: " + email);
  };

  const passwordReset = () => {
    const APIresponse = ResetPassword(email);

    if (APIresponse.success === true) {
      setsuccessfullLogin(true);
    } else {
      setsuccessfullLogin(false);
    }
  };

  function generateMessage() {
    if (successfullLogin) {
      return (
        <div>
          <h2 className="success">Success! Password reset sent to email</h2>
          <hr />
        </div>
      );
    } else {
      return (
        <div>
          <h2 className="error">Error! Failed to send reset to email</h2>
          <hr />
        </div>
      );
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>John Cage Tribute</h1>
          <h2>Enter your email below to reset your password</h2>
          <hr />
        </div>

        <div id="login-input" className="input-group">
          <label htmlFor="Email">Email</label>
          <input
            type="text"
            name="email"
            id="login-email"
            onChange={handleChange}
            placeholder="example@gmail.com"
          />
          <input type="button" value="Send" onClick={passwordReset} />
        </div>
        <div>{successfullLogin && generateMessage()}</div>
      </div>
    </div>
  );
};

export default ResetPass;
