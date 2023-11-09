import React, { useState } from "react";
import { Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import profileImage from '../Images/default-image.jpg';
function ProfileButton() {
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () =>{
    setShowDropdown(!showDropdown);
  }

  return (
    <div>
      <Image
        src={profileImage}
        alt="Profile"
        width={30}
        height={30}
        roundedCircle
        onClick={toggleDropdown}
      />
      {showDropdown && (
        <Dropdown show={showDropdown} onToggle={toggleDropdown} align="end" drop="down">
          <Dropdown.Menu>
            <Link to='/Login' className="dropdown-item">
              Login
            </Link>
            <Link to="/Register" className="dropdown-item">
              Register
            </Link>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
}

export default ProfileButton;
