import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { BASE_URL } from "../utils/constants.js";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../redux/userSlice.js";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("Aditya@gmail.com");
  const [password, setPassword] = useState("Aditya@123");
  const [error, setError] = useState("")

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleLogin () {

    try {

        setError("");
        
        const res = await axios.post(BASE_URL+"/login",
          {
            email,
            password
          },
          { withCredentials: true}
        );

        console.log("res ✅: ", res);

        dispatch(addUser(res.data));
        navigate("/home");

    } catch (err) {
       setError(err?.response?.data || err.message || "Something went wrong!");
    }

  };

  async function handleSignUp () {

        try {

        setError("");
        
        const res = await axios.post(BASE_URL+"/signup",
          {
            firstName,
            lastName,
            email,
            password
          },
          { withCredentials: true}
        );

        navigate("/home");
        
    } catch (err) {
        setError(err?.response?.data || err.message || "Something went wrong!");
    }

  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="card w-full max-w-sm shadow-xl bg-base-100">
        <div className="card-body border">
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Login" : "Sign Up"}
          </h2>

          {/* Signup Fields */}
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full mt-2"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />

              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full mt-2"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}

          {/* Common Fields */}
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mt-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mt-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <p className="mt-2 p-1 text-[14px] text-red-600">
            {error}
          </p>

          <button className="btn btn-primary w-full mt-4"
            onClick={isLogin ? handleLogin : handleSignUp}
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>

          <p
            className="text-center mt-2 cursor-pointer text-sm link"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "New user? Sign up"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;