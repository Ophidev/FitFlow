import React from "react";
import Logo from "../assets/logoo.png";

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm border-2 border-base-300 text-base-content justify-between">
      {/* Logo */}
      <div className="flex flex-col items-center">
        <img src={Logo} alt="logo" className="w-15" />
      </div>

      <div class="flex-none">
        <div class="dropdown dropdown-end">
          <div
            tabIndex="0"
            role="button"
            class="btn btn-ghost btn-circle avatar"
          >
            <div class="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex="-1"
            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a class="justify-between">
                Profile
                <span class="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <a>Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
