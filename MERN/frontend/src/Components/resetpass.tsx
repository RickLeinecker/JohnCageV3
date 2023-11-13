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

  const passwordReset = async function passReset()
  {
    const APIresponse = await ResetPassword(email);

    if (APIresponse)
    {
      if (APIresponse.success === true) {
        setsuccessfullLogin(true);
      } else {
        setsuccessfullLogin(false);
      }
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
          <h3>
            Enter your email below
            <br />
            to reset your password
          </h3>
          <hr />
        </div>

        <div className="input-group">
          <label htmlFor="Email" style={{ fontSize: "calc(5px + 2vmin)" }}>
            Email
          </label>
          <input
            type="text"
            name="email"
            id="login-email"
            onChange={handleChange}
            placeholder="example@gmail.com"
            style={{
              display: "block",
              padding: "10px",
              width: "100%",
              borderRadius: "1em",
            }}
          />
          <div className="submit-btn">
            <input
              type="button"
              value="Send"
              onClick={passwordReset}
              style={{
                display: "block",
                padding: "5px",
                width: "40%",
                borderRadius: "1em",
                marginTop: "15px",
              }}
            />
          </div>
        </div>
        <div>{successfullLogin && generateMessage()}</div>
      </div>
    </div>
  );
};

export default ResetPass;
