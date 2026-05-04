import React from "react";
import Logo from "../assets/logoo.png";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../redux/userSlice";

const Header = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.post(
        BASE_URL + "/logout",
        {},
        { withCredentials: true }
      );

      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="navbar bg-base-100 shadow-sm border-2 border-base-300 text-base-content px-6 justify-between">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={Logo} alt="logo" className="w-15" />
      </div>

      {/* Nav Items */}
      {user && (
        <div className="hidden md:flex gap-8 font-medium text-[15px]">
          <Link to="/" className="hover:text-primary transition-all duration-200">
            Home
          </Link>
          <Link to="/dashboard" className="hover:text-primary transition-all duration-200">
            Dashboard
          </Link>
          <Link to="/about" className="hover:text-primary transition-all duration-200">
            About
          </Link>
          <Link to="/contact" className="hover:text-primary transition-all duration-200">
            Contact
          </Link>
        </div>
      )}

      {/* Avatar Dropdown */}
      {user && (
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="user-profile"
                  src={user?.profilePicture}
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" className="justify-between">
                  Profile
                  <span className="badge">edit</span>
                </Link>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={handleLogout}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;